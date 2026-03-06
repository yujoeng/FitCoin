import { getAngle } from './fitcoinUtils';

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

// 무릎(25), 발목(27), 발가락(31) — 발목 각도 변화로 감지
// 올라갈 때: 발목 각도 < 75° → 'up'
// 내려올 때: 발목 각도 > 95° → 카운트
export function detectCalfRaise(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[25], landmarks[27], landmarks[31]);
  const rightAngle = getAngle(landmarks[26], landmarks[28], landmarks[32]);
  const angle = (leftAngle + rightAngle) / 2;

  if (angle < 75 && state === 'down') setState('up');
  else if (angle > 95 && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
