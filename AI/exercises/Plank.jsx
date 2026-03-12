import { getAngle } from './fitcoinUtils';

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
  UP_ANGLE: 155,
  DOWN_ANGLE: 140,
  HOLD_TIME_MS: 2000,
};

// 어깨(11), 엉덩이(23), 발목(27) 각도 — 일직선이면 ~180°
// 자세 잡힘: 각도 > 155° → 'up', 1초 유지 후 카운트
let plankTimer = null;
let plankHolding = false;

export function detectPlank(landmarks, state, setCount, setState) {
  const angle = getAngle(
    landmarks[11], // LEFT_SHOULDER
    landmarks[23], // LEFT_HIP
    landmarks[27]  // LEFT_ANKLE
  );

  if (angle > PLANK_THRESHOLD.UP_ANGLE && state === 'down') {
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
  } else if (angle < PLANK_THRESHOLD.DOWN_ANGLE && state === 'up') {
    setState('down');
    plankHolding = false;
    if (plankTimer) { clearTimeout(plankTimer); plankTimer = null; }
  }
  return Math.round(angle);
}
