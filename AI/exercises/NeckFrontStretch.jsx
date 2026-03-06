export const FITCOIN_EXERCISE_NECK_FRONT = {
  id: 'neckFrontStretch',
  name: '목 앞뒤 스트레칭',
  icon: 'ArrowUpDown',
  description: '고개를 앞으로 숙였다 천천히 들어올리세요',
  targetCount: 5,
  camera: 'upper',
  initialState: 'center',
  category: '스트레칭',
};

// 코(0)와 어깨 Y 좌표 차이
// diff < 0: 코가 어깨보다 위 (정자세)
// diff가 커지면(앞으로 숙임) → 'forward'
// 다시 고개 들면 → 카운트
export function detectNeckFrontStretch(landmarks, state, setCount, setState) {
  const nose = landmarks[0];
  const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
  const diff = nose.y - shoulderY; // 양수: 코가 어깨보다 아래(드문 케이스), 음수: 위

  // diff가 -0.15보다 크다(=덜 음수, 고개 숙임) → forward
  if (diff > -0.15 && state === 'center') setState('forward');
  // diff가 -0.30보다 작다(=더 음수, 고개 들림) → 카운트
  else if (diff < -0.30 && state === 'forward') {
    setState('center');
    setCount((p) => p + 1);
  }
  return Math.round(Math.abs(diff) * 100);
}
