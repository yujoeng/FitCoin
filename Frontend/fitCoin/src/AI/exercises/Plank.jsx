import { getAngle, smoothLandmark, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_PLANK = {
  id: 'plank',
  name: '플랭크',
  icon: 'AlignHorizontalJustifyCenter',
  description: '팔을 뻗어 몸을 일직선으로 유지하세요 (10초 유지)',
  targetCount: 5,
  camera: 'full',
  initialState: 'down',
  category: '코어',
};

const PLANK_THRESHOLD = {
  UP_ANGLE: 175,
  DOWN_ANGLE: 160,
  HOLD_TIME_MS: 2000,
};

// 어깨(11), 엉덩이(23), 발목(27) 각도 — 일직선이면 ~180°
// 자세 잡힘: 각도 > 155° → 'up', 1초 유지 후 카운트
let plankTimer = null;
let plankHolding = false;

export function detectPlank(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[12]) || !isVisible(landmarks[24]) || !isVisible(landmarks[28])) return 0;
  if (!hasMovement(24, landmarks[24])) return 0;

  const angle = getAngle(
    smoothLandmark(12, landmarks[12]), // 화면상 왼쪽 (실제 오른쪽 어깨)
    smoothLandmark(24, landmarks[24]), // 화면상 왼쪽 (실제 오른쪽 골반)
    smoothLandmark(28, landmarks[28])  // 화면상 왼쪽 (실제 오른쪽 발목)
  );

  if (isStateHeld('plank_up', angle > PLANK_THRESHOLD.UP_ANGLE, 4) && state === 'down') {
    setState('up');
    plankHolding = true;
    if (!plankTimer) {
      plankTimer = setTimeout(() => {
        if (plankHolding) {
          setCount((p) => p + 1);
        }
        plankTimer = null;
        plankHolding = false;
        setState('down');
      }, PLANK_THRESHOLD.HOLD_TIME_MS); // 2초 유지해야 1카운트
    }
  } else if (isStateHeld('plank_down', angle < PLANK_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') {
    setState('down');
    plankHolding = false;
    if (plankTimer) { clearTimeout(plankTimer); plankTimer = null; }
  }
  return Math.round(angle);
}
