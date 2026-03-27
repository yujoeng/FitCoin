import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_SHOULDER_RAISE = {
  id: 'shoulderRaise',
  name: '숄더레이즈',
  icon: 'Dumbbell',
  description: '팔을 옆으로 어깨 높이까지 들어올렸다 내리세요',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '어깨',
};

const SHOULDER_RAISE_THRESHOLD = {
  UP_ANGLE: 60,
  DOWN_ANGLE: 40,
};

// 엉덩이(23), 어깨(11), 팔꿈치(13) 각도
// 올릴 때: 각도 > 70° → 'up'
// 내릴 때: 각도 < 30° → 카운트 (너무 작은 30→완화)
export function detectShoulderRaise(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[11]) && !isVisible(landmarks[12])) return 0;
  if (!hasMovement(11, landmarks[11]) && !hasMovement(12, landmarks[12])) return 0;

  const leftAngle = getAngle(
    smoothLandmark(24, landmarks[24]), // LEFT_HIP
    smoothLandmark(12, landmarks[12]), // LEFT_SHOULDER
    smoothLandmark(14, landmarks[14])  // LEFT_ELBOW
  );
  const rightAngle = getAngle(
    smoothLandmark(23, landmarks[23]), // RIGHT_HIP
    smoothLandmark(11, landmarks[11]), // RIGHT_SHOULDER
    smoothLandmark(13, landmarks[13])  // RIGHT_ELBOW
  );
  const angle = Math.max(leftAngle, rightAngle); // 더 많이 올린 팔 기준

  if (isStateHeld('shoulderRaise_up', angle > SHOULDER_RAISE_THRESHOLD.UP_ANGLE, 4) && state === 'down') setState('up');
  else if (isStateHeld('shoulderRaise_down', angle < SHOULDER_RAISE_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round(angle);
}
