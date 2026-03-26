import { getDistance, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_SHOULDER_SHRUG = {
  id: 'shoulderShrug',
  name: '어깨 으쓱',
  icon: 'ChevronsUp',
  description: '어깨를 귀 쪽으로 으쓱 올렸다 천천히 내리세요 (10회)',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '어깨',
};

const SHOULDER_SHRUG_THRESHOLD = {
  UP_DIST: 0.07,
  DOWN_DIST: 0.13,
};

// 어깨(11)와 귀(7) 사이 거리 — 어깨가 올라가면 거리↓
// 올릴 때: 거리 < 0.07 → 'up'
// 내릴 때: 거리 > 0.13 → 카운트
export function detectShoulderShrug(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[11]) || !isVisible(landmarks[12]) || !isVisible(landmarks[7]) || !isVisible(landmarks[8])) return 0;
  if (!hasMovement(11, landmarks[11]) && !hasMovement(12, landmarks[12])) return 0;

  const leftDist = getDistance(
    smoothLandmark(11, landmarks[11]), // LEFT_SHOULDER
    smoothLandmark(7, landmarks[7])    // LEFT_EAR
  );
  const rightDist = getDistance(
    smoothLandmark(12, landmarks[12]), // RIGHT_SHOULDER
    smoothLandmark(8, landmarks[8])    // RIGHT_EAR
  );
  const dist = (leftDist + rightDist) / 2;

  if (isStateHeld('shoulderShrug_up', dist < SHOULDER_SHRUG_THRESHOLD.UP_DIST, 4) && state === 'down') setState('up');
  else if (isStateHeld('shoulderShrug_down', dist > SHOULDER_SHRUG_THRESHOLD.DOWN_DIST, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round(dist * 100);
}
