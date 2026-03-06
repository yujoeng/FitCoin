import { getAngle } from './fitcoinUtils';

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

// 엉덩이(23/24), 무릎(25/26), 발목(27/28) — 어느 쪽이든 무릎이 굽히면 감지
// 올릴 때: 어느 한 쪽 각도 < 90° → 'up'
// 내릴 때: 양쪽 모두 > 150° → 카운트
export function detectKneeRaise(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[23], landmarks[25], landmarks[27]);
  const rightAngle = getAngle(landmarks[24], landmarks[26], landmarks[28]);
  const minAngle = Math.min(leftAngle, rightAngle);

  if (minAngle < 90 && state === 'down') setState('up');
  else if (minAngle > 150 && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(minAngle);
}
