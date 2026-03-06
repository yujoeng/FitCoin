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

// 어깨(11), 엉덩이(23), 무릎(25) 각도
// 숙일 때: 각도 < 115° → 'down'
// 일어설 때: 각도 > 160° → 카운트
export function detectHipHinge(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[11], landmarks[23], landmarks[25]);
  const rightAngle = getAngle(landmarks[12], landmarks[24], landmarks[26]);
  const angle = (leftAngle + rightAngle) / 2;

  if (angle < 115 && state === 'up') setState('down');
  else if (angle > 160 && state === 'down') {
    setState('up');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
