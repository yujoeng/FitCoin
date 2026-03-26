import { getCenterPoint, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_NECK_SIDE_STRETCH = {
  id: 'neckSideStretch',
  name: '목 옆 스트레칭',
  icon: 'ArrowLeftRight',
  description: '고개를 천천히 좌우로 기울여보세요 (좌우 1세트)',
  targetCount: 5,
  camera: 'upper',
  initialState: 'center',
  category: '스트레칭',
};

const NECK_SIDE_STRETCH_THRESHOLD = {
  TILTED_DIFF: 0.06,
  CENTER_DIFF: 0.018,
};

// 코(0)와 어깨 중심 X 좌표 차이로 고개 기울기 감지
// 기울임: |diff| > 0.06 → 'tilted'
// 돌아옴: |diff| < 0.018 → 카운트
export function detectNeckSideStretch(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[0]) || !isVisible(landmarks[11]) || !isVisible(landmarks[12])) return 0;
  if (!hasMovement(0, landmarks[0])) return 0;

  const nose = smoothLandmark(0, landmarks[0]); // NOSE
  const shoulderCenterX = getCenterPoint(
    smoothLandmark(11, landmarks[11]), // LEFT_SHOULDER
    smoothLandmark(12, landmarks[12])  // RIGHT_SHOULDER
  ).x;
  const diff = Math.abs(nose.x - shoulderCenterX);

  if (isStateHeld('neckSideStretch_tilted', diff > NECK_SIDE_STRETCH_THRESHOLD.TILTED_DIFF, 4) && state === 'center') setState('tilted');
  else if (isStateHeld('neckSideStretch_center', diff < NECK_SIDE_STRETCH_THRESHOLD.CENTER_DIFF, 4) && state === 'tilted') {
    setState('center');
    tryIncreaseCount(setCount);
  }
  return Math.round(diff * 100);
}
