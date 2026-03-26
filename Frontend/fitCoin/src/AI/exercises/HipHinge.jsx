import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

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
  if (!isVisible(landmarks[11]) || !isVisible(landmarks[12])) return 0;
  if (!hasMovement(11, landmarks[11]) && !hasMovement(12, landmarks[12])) return 0;

  const leftAngle = getAngle(
    smoothLandmark(11, landmarks[11]), // LEFT_SHOULDER
    smoothLandmark(23, landmarks[23]), // LEFT_HIP
    smoothLandmark(25, landmarks[25])  // LEFT_KNEE
  );
  const rightAngle = getAngle(
    smoothLandmark(12, landmarks[12]), // RIGHT_SHOULDER
    smoothLandmark(24, landmarks[24]), // RIGHT_HIP
    smoothLandmark(26, landmarks[26])  // RIGHT_KNEE
  );
  const angle = (leftAngle + rightAngle) / 2;

  if (isStateHeld('hipHinge_down', angle < HIP_HINGE_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') setState('down');
  else if (isStateHeld('hipHinge_up', angle > HIP_HINGE_THRESHOLD.UP_ANGLE, 4) && state === 'down') {
    setState('up');
    tryIncreaseCount(setCount);
  }
  return Math.round(angle);
}
