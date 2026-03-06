import { getAngle } from './fitcoinUtils';

export const FITCOIN_EXERCISE_LUNGE = {
  id: 'lunge',
  name: '런지',
  icon: 'MoveVertical',
  description: '한 발을 앞으로 내딛어 양 무릎을 90°로 굽혔다 일어나세요',
  targetCount: 10,
  camera: 'full',
  initialState: 'up',
  category: '하체',
};

// 앞발 엉덩이(23), 무릎(25), 발목(27) 각도
// 내려갈 때: 무릎 각도 < 110° → 'down'
// 올라올 때: 무릎 각도 > 160° → 카운트
export function detectLunge(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[23], landmarks[25], landmarks[27]);
  const rightAngle = getAngle(landmarks[24], landmarks[26], landmarks[28]);
  const angle = Math.min(leftAngle, rightAngle); // 굽힌 쪽 기준

  if (angle < 110 && state === 'up') setState('down');
  else if (angle > 160 && state === 'down') {
    setState('up');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
