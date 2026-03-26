import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

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
  if (!isVisible(landmarks[15]) && !isVisible(landmarks[16])) return 0;

  const moveIdx = isVisible(landmarks[15]) ? 15 : 16;
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return 0;

  const leftAngle = getAngle(
    smoothLandmark(13, landmarks[13]), // LEFT_ELBOW
    smoothLandmark(15, landmarks[15]), // LEFT_WRIST
    smoothLandmark(19, landmarks[19])  // LEFT_INDEX
  );
  const rightAngle = getAngle(
    smoothLandmark(14, landmarks[14]), // RIGHT_ELBOW
    smoothLandmark(16, landmarks[16]), // RIGHT_WRIST
    smoothLandmark(20, landmarks[20])  // RIGHT_INDEX
  );
  const angle = Math.min(leftAngle, rightAngle);

  if (isStateHeld('wristStretch_bent', angle < WRIST_STRETCH_THRESHOLD.BENT_ANGLE, 4) && state === 'center') setState('bent');
  else if (isStateHeld('wristStretch_center', angle > WRIST_STRETCH_THRESHOLD.CENTER_ANGLE, 4) && state === 'bent') {
    setState('center');
    tryIncreaseCount(setCount);
  }
  return Math.round(angle);
}
