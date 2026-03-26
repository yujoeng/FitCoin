import { getDistanceX, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

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

const CHEST_OPEN_THRESHOLD = {
  OPEN_RATIO: 1.3,
  CLOSED_RATIO: 1.05,
};

// 양 손목(15,16) 거리 / 양 어깨(11,12) 거리 비율
// 손목이 어깨너비보다 훨씬 벌어지면 → 가슴 열기 실패
// 손목이 어깨 뒤로 가면 손목 X 좌표가 어깨 바깥으로 나감
// ratio가 크면 팔이 넓게 벌어짐 = 가슴 열림
// 완화: 1.3 / 1.05
export function detectChestOpen(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[15]) || !isVisible(landmarks[16])) return 0;
  if (!hasMovement(15, landmarks[15]) && !hasMovement(16, landmarks[16])) return 0;

  const wristDist = getDistanceX(
    smoothLandmark(15, landmarks[15]), // LEFT_WRIST
    smoothLandmark(16, landmarks[16])  // RIGHT_WRIST
  );
  const shoulderDist = getDistanceX(
    smoothLandmark(11, landmarks[11]), // LEFT_SHOULDER
    smoothLandmark(12, landmarks[12])  // RIGHT_SHOULDER
  ) || 0.01;
  const ratio = wristDist / shoulderDist;

  if (isStateHeld('chestOpen_open', ratio > CHEST_OPEN_THRESHOLD.OPEN_RATIO, 4) && state === 'closed') setState('open');
  else if (isStateHeld('chestOpen_closed', ratio < CHEST_OPEN_THRESHOLD.CLOSED_RATIO, 4) && state === 'open') {
    setState('closed');
    tryIncreaseCount(setCount);
  }
  return Math.round(ratio * 100);
}
