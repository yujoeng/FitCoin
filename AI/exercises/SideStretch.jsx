export const FITCOIN_EXERCISE_SIDE_STRETCH = {
  id: 'sideStretch',
  name: '옆구리 스트레칭',
  icon: 'MoveHorizontal',
  description: '팔을 머리 위로 들고 옆으로 몸을 기울여보세요 (좌우 1세트)',
  targetCount: 5,
  camera: 'upper',
  initialState: 'center',
  category: '스트레칭',
};

// 왼쪽 어깨(11) Y와 오른쪽 어깨(12) Y 차이
// 몸 기울이면 어깨 높이 차이가 발생
// |diff| > 0.05 → 'tilted', < 0.015 → 카운트
export function detectSideStretch(landmarks, state, setCount, setState) {
  const diff = Math.abs(landmarks[11].y - landmarks[12].y);

  if (diff > 0.05 && state === 'center') setState('tilted');
  else if (diff < 0.015 && state === 'tilted') {
    setState('center');
    setCount((p) => p + 1);
  }
  return Math.round(diff * 100);
}
