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

// 어깨(11), 엉덩이(23), 발목(27) 각도 — 일직선이면 ~180°
// 자세 잡힘: 각도 > 155° → 'up', 1초 유지 후 카운트
let plankTimer = null;
let plankHolding = false;

export function detectPlank(landmarks, state, setCount, setState) {
  const angle = getAngle(landmarks[11], landmarks[23], landmarks[27]);

  if (angle > 155 && state === 'down') {
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
      }, 2000); // 2초 유지해야 1카운트
    }
  } else if (angle < 140 && state === 'up') {
    setState('down');
    plankHolding = false;
    if (plankTimer) { clearTimeout(plankTimer); plankTimer = null; }
  }
  return Math.round(angle);
}
