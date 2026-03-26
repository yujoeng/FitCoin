import { getCenterPoint, getDistanceY, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_OVERHEAD_PRESS = {
  id: 'overheadPress',
  name: '오버헤드 프레스',
  icon: 'ArrowUpToLine',
  description: '양팔을 머리 위로 쭉 올렸다 어깨 높이로 내리세요 (아령 가능)',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '어깨',
};

const OVERHEAD_PRESS_THRESHOLD = {
  UP_OFFSET: 0.08,
  DOWN_OFFSET: 0.03,
};

// 손목(15/16)이 어깨(11/12)보다 위에 있으면 'up'
// 손목이 어깨보다 아래로 내려오면 카운트
export function detectOverheadPress(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[15]) || !isVisible(landmarks[16])) return 0;
  if (!hasMovement(15, landmarks[15]) && !hasMovement(16, landmarks[16])) return 0;

  const leftWrist = smoothLandmark(16, landmarks[16]); // LEFT_WRIST
  const rightWrist = smoothLandmark(15, landmarks[15]); // RIGHT_WRIST
  const leftShoulder = smoothLandmark(12, landmarks[12]); // LEFT_SHOULDER
  const rightShoulder = smoothLandmark(11, landmarks[11]); // RIGHT_SHOULDER

  // 손목 y좌표가 작을수록 위 (MediaPipe: y=0이 화면 위)
  const leftUp = leftWrist.y < leftShoulder.y - OVERHEAD_PRESS_THRESHOLD.UP_OFFSET;
  const rightUp = rightWrist.y < rightShoulder.y - OVERHEAD_PRESS_THRESHOLD.UP_OFFSET;
  const bothUp = leftUp && rightUp;

  const leftDown = leftWrist.y > leftShoulder.y + OVERHEAD_PRESS_THRESHOLD.DOWN_OFFSET;
  const rightDown = rightWrist.y > rightShoulder.y + OVERHEAD_PRESS_THRESHOLD.DOWN_OFFSET;
  const bothDown = leftDown && rightDown;

  const wristCenter = getCenterPoint(leftWrist, rightWrist);
  const shoulderCenter = getCenterPoint(leftShoulder, rightShoulder);
  const dispY = Math.round(getDistanceY(wristCenter, shoulderCenter) * 100);

  if (isStateHeld('overheadPress_up', bothUp, 4) && state === 'down') setState('up');
  else if (isStateHeld('overheadPress_down', bothDown, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return dispY;
}
