import { getAngle, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_BICEP_CURL = {
  id: 'bicepCurl',
  name: '아령 컬',
  icon: 'Dumbbell',
  description: '팔꿈치를 몸에 붙이고 아령을 들어올렸다 내리세요',
  targetCount: 10,
  camera: 'upper',
  initialState: 'down',
  category: '팔',
};

const BICEP_CURL_THRESHOLD = {
  UP_ANGLE: 60,
  DOWN_ANGLE: 145,
};

// 어깨(11), 팔꿈치(13), 손목(15) — 왼팔
// 올릴 때: 팔꿈치 각도 < 60° → 'up'
// 내릴 때: 팔꿈치 각도 > 145° → 카운트
export function detectBicepCurl(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[13]) && !isVisible(landmarks[14])) return 0;

  const moveIdx = isVisible(landmarks[13]) ? 13 : 14;
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return 0;

  const leftVisible = isVisible(landmarks[13]);
  const rightVisible = isVisible(landmarks[14]);

  const leftAngle = leftVisible ? getAngle(
    smoothLandmark(11, landmarks[11]),
    smoothLandmark(13, landmarks[13]),
    smoothLandmark(15, landmarks[15])
  ) : Number.POSITIVE_INFINITY;
  const rightAngle = rightVisible ? getAngle(
    smoothLandmark(12, landmarks[12]),
    smoothLandmark(14, landmarks[14]),
    smoothLandmark(16, landmarks[16])
  ) : Number.POSITIVE_INFINITY;
  const angle = leftVisible && rightVisible ? Math.min(leftAngle, rightAngle) : (leftVisible ? leftAngle : rightAngle);

  if (isStateHeld('bicepCurl_up', angle < BICEP_CURL_THRESHOLD.UP_ANGLE, 4) && state === 'down') setState('up');
  else if (isStateHeld('bicepCurl_down', angle > BICEP_CURL_THRESHOLD.DOWN_ANGLE, 4) && state === 'up') {
    setState('down');
    tryIncreaseCount(setCount);
  }
  return Math.round(angle);
}
