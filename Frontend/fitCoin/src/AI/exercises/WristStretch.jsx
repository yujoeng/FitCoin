import { smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_WRIST_STRETCH = {
  id: 'wristStretch',
  name: '손목 스트레칭',
  icon: 'Hand',
  description: '팔을 앞으로 뻗고 손목을 위아래로 꺾어보세요',
  targetCount: 5,
  camera: 'upper',
  initialState: 'center',
  category: '스트레칭',
};

const WRIST_STRETCH_THRESHOLD = {
  UP_DIFF: 0.04,
  DOWN_DIFF: 0.02,
};

// 손목(15,16), 검지 끝(19,20) Y축 차이로 위로 꺾임 감지
// 위로 꺾임: finger.y < wrist.y - 0.04 → 'bent'
// 펴짐: |finger.y - wrist.y| < 0.02 → 카운트
export function detectWristStretch(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[15]) && !isVisible(landmarks[16])) return 0;

  const moveIdx = isVisible(landmarks[16]) ? 16 : 15;
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return 0;

  const wristY = smoothLandmark(moveIdx, landmarks[moveIdx]).y;
  const fingerIdx = moveIdx === 16 ? 20 : 19;
  const fingerY = smoothLandmark(fingerIdx, landmarks[fingerIdx]).y;

  if (isStateHeld('wristStretch_bent', fingerY < wristY - WRIST_STRETCH_THRESHOLD.UP_DIFF, 4) && state === 'center') setState('bent');
  else if (isStateHeld('wristStretch_center', Math.abs(fingerY - wristY) < WRIST_STRETCH_THRESHOLD.DOWN_DIFF, 4) && state === 'bent') {
    setState('center');
    tryIncreaseCount(setCount);
  }
  return Math.round((wristY - fingerY) * 100);
}
