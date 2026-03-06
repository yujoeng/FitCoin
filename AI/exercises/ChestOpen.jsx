export const FITCOIN_EXERCISE_CHEST_OPEN = {
  id: 'chestOpen',
  name: '가슴 펴기',
  icon: 'Expand',
  description: '팔을 뒤로 당겨 가슴을 활짝 펴보세요 (어깨 뒤로 조임)',
  targetCount: 5,
  camera: 'upper',
  initialState: 'closed',
  category: '스트레칭',
};

// 양 손목(15,16) 거리 / 양 어깨(11,12) 거리 비율
// 손목이 어깨너비보다 훨씬 벌어지면 → 가슴 열기 실패
// 손목이 어깨 뒤로 가면 손목 X 좌표가 어깨 바깥으로 나감
// ratio가 크면 팔이 넓게 벌어짐 = 가슴 열림
// 완화: 1.3 / 1.05
export function detectChestOpen(landmarks, state, setCount, setState) {
  const wristDist = Math.abs(landmarks[15].x - landmarks[16].x);
  const shoulderDist = Math.abs(landmarks[11].x - landmarks[12].x) || 0.01;
  const ratio = wristDist / shoulderDist;

  if (ratio > 1.3 && state === 'closed') setState('open');
  else if (ratio < 1.05 && state === 'open') {
    setState('closed');
    setCount((p) => p + 1);
  }
  return Math.round(ratio * 100);
}
