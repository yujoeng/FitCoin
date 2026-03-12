import { getAngle } from './fitcoinUtils';

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
  const leftAngle = getAngle(
    landmarks[11], // LEFT_SHOULDER
    landmarks[13], // LEFT_ELBOW
    landmarks[15]  // LEFT_WRIST
  );
  const rightAngle = getAngle(
    landmarks[12], // RIGHT_SHOULDER
    landmarks[14], // RIGHT_ELBOW
    landmarks[16]  // RIGHT_WRIST
  );
  const angle = Math.min(leftAngle, rightAngle); // 어느 팔이든 먼저 닿으면

  if (angle < BICEP_CURL_THRESHOLD.UP_ANGLE && state === 'down') setState('up');
  else if (angle > BICEP_CURL_THRESHOLD.DOWN_ANGLE && state === 'up') {
    setState('down');
    setCount((p) => p + 1);
  }
  return Math.round(angle);
}
