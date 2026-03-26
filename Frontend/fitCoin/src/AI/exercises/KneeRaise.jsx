import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_KNEE_RAISE = {
  id: 'kneeRaise',
  name: '무릎 올리기',
  icon: 'MoveUp',
  description: '제자리에서 무릎을 번갈아 배꼽 높이까지 올려보세요',
  targetCount: 20,
  camera: 'full',
  initialState: 'down',
  category: '유산소',
};

const KNEE_RAISE_THRESHOLD = {
  UP_ANGLE: 90,
  DOWN_ANGLE: 150,
};

// 엉덩이(23/24), 무릎(25/26), 발목(27/28) — 어느 쪽이든 무릎이 굽히면 감지
// 올릴 때: 어느 한 쪽 각도 < 90° → 'up'
// 내릴 때: 양쪽 모두 > 150° → 카운트
export function detectKneeRaise(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[25]) && !isVisible(landmarks[26])) return 0;

  const moveIdx = isVisible(landmarks[25]) ? 25 : 26;
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return 0;

  const leftAngle = getAngle(
    smoothLandmark(23, landmarks[23]), // LEFT_HIP
    smoothLandmark(25, landmarks[25]), // LEFT_KNEE
    smoothLandmark(27, landmarks[27])  // LEFT_ANKLE
  );
  const rightAngle = getAngle(
    smoothLandmark(24, landmarks[24]), // RIGHT_HIP
    smoothLandmark(26, landmarks[26]), // RIGHT_KNEE
    smoothLandmark(28, landmarks[28])  // RIGHT_ANKLE
  );
  const minAngle = Math.min(leftAngle, rightAngle);

  if (isStateHeld('kneeRaise_up', minAngle < KNEE_RAISE_THRESHOLD.UP_ANGLE, 4) && state === 'down') setState('up');
  else if (isStateHeld('kneeRaise_down', minAngle > KNEE_RAISE_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round(minAngle);
}
