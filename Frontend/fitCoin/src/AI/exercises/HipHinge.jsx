import { getAngle } from './fitcoinUtils';

export const FITCOIN_EXERCISE_HIP_HINGE = {
  id: 'hipHinge',
  name: '힙힌지',
  icon: 'RefreshCw',
  description: '등을 펴고 허리를 앞으로 숙였다 다시 일어나세요',
  targetCount: 10,
  camera: 'full',
  initialState: 'up',
  category: '코어',
};

const HIP_HINGE_THRESHOLD = {
  DOWN_ANGLE: 115,
  UP_ANGLE: 160,
};

// 어깨(11), 엉덩이(23), 무릎(25) 각도
// 숙일 때: 각도 < 115° → 'down'
// 일어설 때: 각도 > 160° → 카운트
export function detectHipHinge(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(
    landmarks[11], // LEFT_SHOULDER
    landmarks[23], // LEFT_HIP
    landmarks[25]  // LEFT_KNEE
  );
  const rightAngle = getAngle(
    landmarks[12], // RIGHT_SHOULDER
    landmarks[24], // RIGHT_HIP
    landmarks[26]  // RIGHT_KNEE
  );
  const angle = (leftAngle + rightAngle) / 2;

  if (angle < HIP_HINGE_THRESHOLD.DOWN_ANGLE && state === 'up') setState('down');
  else if (angle > HIP_HINGE_THRESHOLD.UP_ANGLE && state === 'down') {
    setState('up');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
