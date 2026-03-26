import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_CALF_RAISE = {
  id: 'calfRaise',
  name: '카프레이즈',
  icon: 'ArrowUpFromLine',
  description: '서서 발끝으로 올라갔다 천천히 내려오세요',
  targetCount: 15,
  camera: 'full',
  initialState: 'down',
  category: '하체',
};

const CALF_RAISE_THRESHOLD = {
  UP_ANGLE: 75,
  DOWN_ANGLE: 95,
};

// 무릎(25), 발목(27), 발가락(31) — 발목 각도 변화로 감지
// 올라갈 때: 발목 각도 < 75° → 'up'
// 내려올 때: 발목 각도 > 95° → 카운트
export function detectCalfRaise(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[27]) || !isVisible(landmarks[28])) return 0;
  if (!hasMovement(27, landmarks[27]) && !hasMovement(28, landmarks[28])) return 0;

  const leftAngle = getAngle(
    smoothLandmark(25, landmarks[25]), // LEFT_KNEE
    smoothLandmark(27, landmarks[27]), // LEFT_ANKLE
    smoothLandmark(31, landmarks[31])  // LEFT_FOOT_INDEX
  );
  const rightAngle = getAngle(
    smoothLandmark(26, landmarks[26]), // RIGHT_KNEE
    smoothLandmark(28, landmarks[28]), // RIGHT_ANKLE
    smoothLandmark(32, landmarks[32])  // RIGHT_FOOT_INDEX
  );
  const angle = (leftAngle + rightAngle) / 2;

  if (isStateHeld('calfRaise_up', angle < CALF_RAISE_THRESHOLD.UP_ANGLE, 4) && state === 'down') setState('up');
  else if (isStateHeld('calfRaise_down', angle > CALF_RAISE_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round(angle);
}
