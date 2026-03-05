import { getAngle } from './fitcoinUtils';

export const FITCOIN_EXERCISE_SHOULDER_RAISE = {
  id: 'shoulderRaise',
  name: '숄더레이즈',
  icon: 'Dumbbell',
  description: '팔을 옆으로 어깨 높이까지 들어올렸다 내리세요 (아령 가능)',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '어깨',
};

// 엉덩이(23), 어깨(11), 팔꿈치(13) 각도
// 올릴 때: 각도 > 70° → 'up'
// 내릴 때: 각도 < 30° → 카운트 (너무 작은 30→완화)
export function detectShoulderRaise(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[23], landmarks[11], landmarks[13]);
  const rightAngle = getAngle(landmarks[24], landmarks[12], landmarks[14]);
  const angle = Math.max(leftAngle, rightAngle); // 더 많이 올린 팔 기준

  if (angle > 70 && state === 'down') setState('up');
  else if (angle < 35 && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
