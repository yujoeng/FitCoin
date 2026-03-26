import { getDistanceY, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_CALF_RAISE = {
  id: 'calfRaise',
  name: '카프레이즈',
  icon: 'ArrowUpFromLine',
  description: '서서 발끝으로 올라갔다 천천히 내려오세요',
  targetCount: 15,
  camera: 'full',
  initialState: 'down',
  category: '하체',
};

const CALF_RAISE_THRESHOLD = {
  UP_DIFF: 0.03,
  DOWN_DIFF: 0.06,
};

// 발목(27,28), 발뒤꿈치(29,30) — 발목과 발뒤꿈치의 Y축 거리로 감지
// 올라갈 때: 발목과 발뒤꿈치 거리가 0.03 미만 → 'up'
// 내려올 때: 발목과 발뒤꿈치 거리가 0.06 초과 → 카운트
export function detectCalfRaise(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[27]) || !isVisible(landmarks[28])) return 0;
  if (!hasMovement(27, landmarks[27]) && !hasMovement(28, landmarks[28])) return 0;

  const leftDiff = getDistanceY(
    smoothLandmark(28, landmarks[28]), // LEFT_ANKLE
    smoothLandmark(30, landmarks[30])  // LEFT_HEEL
  );
  const rightDiff = getDistanceY(
    smoothLandmark(27, landmarks[27]), // RIGHT_ANKLE
    smoothLandmark(29, landmarks[29])  // RIGHT_HEEL
  );
  const diff = (leftDiff + rightDiff) / 2;

  if (isStateHeld('calfRaise_up', diff < CALF_RAISE_THRESHOLD.UP_DIFF, 4) && state === 'down') setState('up');
  else if (isStateHeld('calfRaise_down', diff > CALF_RAISE_THRESHOLD.DOWN_DIFF, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round(diff * 100);
}
