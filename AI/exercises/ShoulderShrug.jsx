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

// 어깨(11)와 귀(7) 사이 거리 — 어깨가 올라가면 거리↓
// 올릴 때: 거리 < 0.07 → 'up'
// 내릴 때: 거리 > 0.13 → 카운트
export function detectShoulderShrug(landmarks, state, setCount, setState) {
  const leftDist = getDistance(landmarks[11], landmarks[7]);
  const rightDist = getDistance(landmarks[12], landmarks[8]);
  const dist = (leftDist + rightDist) / 2;

  if (dist < 0.07 && state === 'down') setState('up');
  else if (dist > 0.13 && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(dist * 100);
}
