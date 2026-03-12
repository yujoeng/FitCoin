import { getDistanceY } from './fitcoinUtils';

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

const SIDE_STRETCH_THRESHOLD = {
  TILTED_DIFF: 0.05,
  CENTER_DIFF: 0.015,
};

// 왼쪽 어깨(11) Y와 오른쪽 어깨(12) Y 차이
// 몸 기울이면 어깨 높이 차이가 발생
// |diff| > 0.05 → 'tilted', < 0.015 → 카운트
export function detectSideStretch(landmarks, state, setCount, setState) {
  const diff = getDistanceY(
    landmarks[11], // LEFT_SHOULDER
    landmarks[12]  // RIGHT_SHOULDER
  );

  if (diff > SIDE_STRETCH_THRESHOLD.TILTED_DIFF && state === 'center') setState('tilted');
  else if (diff < SIDE_STRETCH_THRESHOLD.CENTER_DIFF && state === 'tilted') {
    setState('center');
    setCount((p) => p + 1);
  }
  return Math.round(diff * 100);
}
