import { getDistance } from './fitcoinUtils';

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
  const leftDist = getDistance(
    landmarks[11], // LEFT_SHOULDER
    landmarks[7]   // LEFT_EAR
  );
  const rightDist = getDistance(
    landmarks[12], // RIGHT_SHOULDER
    landmarks[8]   // RIGHT_EAR
  );
  const dist = (leftDist + rightDist) / 2;

  if (dist < SHOULDER_SHRUG_THRESHOLD.UP_DIST && state === 'down') setState('up');
  else if (dist > SHOULDER_SHRUG_THRESHOLD.DOWN_DIST && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(dist * 100);
}
