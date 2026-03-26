import { smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_KNEE_RAISE = {
  id: 'kneeRaise',
  name: '무릎 올리기',
  icon: 'MoveUp',
  description: '제자리에서 무릎을 번갈아 배꼽 높이까지 올려보세요',
  targetCount: 20,
  camera: 'full',
  initialState: 'down',
  category: '유산소',
};

const KNEE_RAISE_THRESHOLD = {
  UP_DIFF: 0.05,
  DOWN_DIFF: 0.01,
};

// 엉덩이(23,24), 무릎(25,26) — 무릎과 엉덩이의 Y축 차이로 감지
// 올릴 때: min(무릎y) < min(엉덩이y) - 0.05 → 'up'
// 내릴 때: min(무릎y) > min(엉덩이y) - 0.01 → 카운트
export function detectKneeRaise(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[25]) && !isVisible(landmarks[26])) return 0;

  const moveIdx = isVisible(landmarks[26]) ? 26 : 25;
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return 0;

  const leftKnee = smoothLandmark(26, landmarks[26]);
  const rightKnee = smoothLandmark(25, landmarks[25]);
  const leftHip = smoothLandmark(24, landmarks[24]);
  const rightHip = smoothLandmark(23, landmarks[23]);

  const minKneeY = Math.min(leftKnee.y, rightKnee.y);
  const minHipY = Math.min(leftHip.y, rightHip.y);

  if (isStateHeld('kneeRaise_up', minKneeY < minHipY - KNEE_RAISE_THRESHOLD.UP_DIFF, 4) && state === 'down') setState('up');
  else if (isStateHeld('kneeRaise_down', minKneeY > minHipY - KNEE_RAISE_THRESHOLD.DOWN_DIFF, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round((minHipY - minKneeY) * 100);
}
