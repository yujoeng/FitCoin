import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_LUNGE = {
  id: 'lunge',
  name: '런지',
  icon: 'MoveVertical',
  description: '한 발을 앞으로 내딛어 양 무릎을 90°로 굽혔다 일어나세요',
  targetCount: 10,
  camera: 'full',
  initialState: 'up',
  category: '하체',
};

const LUNGE_THRESHOLD = {
  DOWN_ANGLE: 110,
  UP_ANGLE: 160,
};

// 앞발 엉덩이(23), 무릎(25), 발목(27) 각도
// 내려갈 때: 무릎 각도 < 110° → 'down'
// 올라올 때: 무릎 각도 > 160° → 카운트
export function detectLunge(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[25]) && !isVisible(landmarks[26])) return 0;

  const moveIdx = isVisible(landmarks[25]) ? 25 : 26;
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return 0;

  const leftAngle = getAngle(
    smoothLandmark(23, landmarks[23]), // LEFT_HIP
    smoothLandmark(25, landmarks[25]), // LEFT_KNEE
    smoothLandmark(27, landmarks[27])  // LEFT_ANKLE
  );
  const rightAngle = getAngle(
    smoothLandmark(24, landmarks[24]), // RIGHT_HIP
    smoothLandmark(26, landmarks[26]), // RIGHT_KNEE
    smoothLandmark(28, landmarks[28])  // RIGHT_ANKLE
  );
  const angle = Math.min(leftAngle, rightAngle); // 굽힌 쪽 기준

  if (isStateHeld('lunge_down', angle < LUNGE_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') setState('down');
  else if (isStateHeld('lunge_up', angle > LUNGE_THRESHOLD.UP_ANGLE, 4) && state === 'down') {
    setState('up');
    tryIncreaseCount(setCount);
  }
  return Math.round(angle);
}
