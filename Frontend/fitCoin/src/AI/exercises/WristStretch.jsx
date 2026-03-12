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

const WRIST_STRETCH_THRESHOLD = {
  BENT_ANGLE: 150,
  CENTER_ANGLE: 170,
};

// 팔꿈치(13), 손목(15), 검지 끝(19)  각도
// 꺾임: 각도 < 150° → 'bent'
// 펴짐: 각도 > 170° → 카운트
export function detectWristStretch(landmarks, state, setCount, setState) {
  const leftAngle = getAngle(
    landmarks[13], // LEFT_ELBOW
    landmarks[15], // LEFT_WRIST
    landmarks[19]  // LEFT_INDEX
  );
  const rightAngle = getAngle(
    landmarks[14], // RIGHT_ELBOW
    landmarks[16], // RIGHT_WRIST
    landmarks[20]  // RIGHT_INDEX
  );
  const angle = Math.min(leftAngle, rightAngle);

  if (angle < WRIST_STRETCH_THRESHOLD.BENT_ANGLE && state === 'center') setState('bent');
  else if (angle > WRIST_STRETCH_THRESHOLD.CENTER_ANGLE && state === 'bent') {
    setState('center');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
