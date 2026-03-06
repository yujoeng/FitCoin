import { getAngle } from './fitcoinUtils';

export const FITCOIN_EXERCISE_WRIST_STRETCH = {
  id: 'wristStretch',
  name: '손목 스트레칭',
  icon: 'Hand',
  description: '팔을 앞으로 뻗고 손목을 위아래로 꺾어보세요',
  targetCount: 5,
  camera: 'upper',
  initialState: 'center',
  category: '스트레칭',
};

// 팔꿈치(13), 손목(15), 검지 끝(19)  각도
// 꺾임: 각도 < 150° → 'bent'
// 펴짐: 각도 > 170° → 카운트
export function detectWristStretch(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(landmarks[13], landmarks[15], landmarks[19]);
  const rightAngle = getAngle(landmarks[14], landmarks[16], landmarks[20]);
  const angle = Math.min(leftAngle, rightAngle);

  if (angle < 150 && state === 'center') setState('bent');
  else if (angle > 170 && state === 'bent') {
    setState('center');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
