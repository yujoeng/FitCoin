import { getAngle } from './fitcoinUtils';

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
  const leftAngle = getAngle(
    landmarks[23], // LEFT_HIP
    landmarks[25], // LEFT_KNEE
    landmarks[27]  // LEFT_ANKLE
  );
  const rightAngle = getAngle(
    landmarks[24], // RIGHT_HIP
    landmarks[26], // RIGHT_KNEE
    landmarks[28]  // RIGHT_ANKLE
  );
  const angle = Math.min(leftAngle, rightAngle); // 굽힌 쪽 기준

  if (angle < LUNGE_THRESHOLD.DOWN_ANGLE && state === 'up') setState('down');
  else if (angle > LUNGE_THRESHOLD.UP_ANGLE && state === 'down') {
    setState('up');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
