import { getCenterPoint, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_NECK_FRONT_STRETCH = {
  id: 'neckFrontStretch',
  name: '목 앞뒤 스트레칭',
  icon: 'ArrowUpDown',
  description: '고개를 앞으로 숙였다 천천히 들어올리세요',
  targetCount: 5,
  camera: 'upper',
  initialState: 'center',
  category: '스트레칭',
};

const NECK_FRONT_STRETCH_THRESHOLD = {
  FORWARD_DIFF: -0.15,
  CENTER_DIFF: -0.30,
};

// 코(0)와 어깨 Y 좌표 차이
// diff < 0: 코가 어깨보다 위 (정자세)
// diff가 커지면(앞으로 숙임) → 'forward'
// 다시 고개 들면 → 카운트
export function detectNeckFrontStretch(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[0]) || !isVisible(landmarks[11]) || !isVisible(landmarks[12])) return 0;
  if (!hasMovement(0, landmarks[0])) return 0;

  const nose = smoothLandmark(0, landmarks[0]); // NOSE
  const shoulderY = getCenterPoint(
    smoothLandmark(11, landmarks[11]), // LEFT_SHOULDER
    smoothLandmark(12, landmarks[12])  // RIGHT_SHOULDER
  ).y;
  const diff = nose.y - shoulderY; // 양수: 코가 어깨보다 아래(드문 케이스), 음수: 위

  // diff가 -0.15보다 크다(=덜 음수, 고개 숙임) → forward
  if (isStateHeld('neckFrontStretch_forward', diff > NECK_FRONT_STRETCH_THRESHOLD.FORWARD_DIFF, 4) && state === 'center') setState('forward');
  // diff가 -0.30보다 작다(=더 음수, 고개 들림) → 카운트
  else if (isStateHeld('neckFrontStretch_center', diff < NECK_FRONT_STRETCH_THRESHOLD.CENTER_DIFF, 4) && state === 'forward') {
    setState('center');
    tryIncreaseCount(setCount);
  }
  return Math.round(Math.abs(diff) * 100);
}
