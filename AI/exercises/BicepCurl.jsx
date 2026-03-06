import { getAngle } from './fitcoinUtils';

export const FITCOIN_EXERCISE_BICEP_CURL = {
  id: 'bicepCurl',
  name: '아령 컬',
  icon: 'Dumbbell',
  description: '팔꿈치를 몸에 붙이고 아령을 들어올렸다 내리세요',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '팔',
};

// 어깨(11), 팔꿈치(13), 손목(15) — 왼팔
// 올릴 때: 팔꿈치 각도 < 60° → 'up'
// 내릴 때: 팔꿈치 각도 > 145° → 카운트
export function detectBicepCurl(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[11], landmarks[13], landmarks[15]);
  const rightAngle = getAngle(landmarks[12], landmarks[14], landmarks[16]);
  const angle = Math.min(leftAngle, rightAngle); // 어느 팔이든 먼저 닿으면

  if (angle < 60 && state === 'down') setState('up');
  else if (angle > 145 && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
