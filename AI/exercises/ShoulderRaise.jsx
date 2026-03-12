import { getAngle } from './fitcoinUtils';

export const FITCOIN_EXERCISE_SHOULDER_RAISE = {
  id: 'shoulderRaise',
  name: '숄더레이즈',
  icon: 'Dumbbell',
  description: '팔을 옆으로 어깨 높이까지 들어올렸다 내리세요 (아령 가능)',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '어깨',
};

const SHOULDER_RAISE_THRESHOLD = {
  UP_ANGLE: 70,
  DOWN_ANGLE: 35,
};

// 엉덩이(23), 어깨(11), 팔꿈치(13) 각도
// 올릴 때: 각도 > 70° → 'up'
// 내릴 때: 각도 < 30° → 카운트 (너무 작은 30→완화)
export function detectShoulderRaise(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(
    landmarks[23], // LEFT_HIP
    landmarks[11], // LEFT_SHOULDER
    landmarks[13]  // LEFT_ELBOW
  );
  const rightAngle = getAngle(
    landmarks[24], // RIGHT_HIP
    landmarks[12], // RIGHT_SHOULDER
    landmarks[14]  // RIGHT_ELBOW
  );
  const angle = Math.max(leftAngle, rightAngle); // 더 많이 올린 팔 기준

  if (angle > SHOULDER_RAISE_THRESHOLD.UP_ANGLE && state === 'down') setState('up');
  else if (angle < SHOULDER_RAISE_THRESHOLD.DOWN_ANGLE && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
