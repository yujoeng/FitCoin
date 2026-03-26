import { getAngle, SQUAT_FEEDBACK, smoothLandmark, tryIncreaseCount, isVisible, hasMovement, isStateHeld } from './fitcoinUtils';

export const FITCOIN_EXERCISE_SQUAT = {
  id: 'squat',
  name: '스쿼트',
  icon: 'PersonStanding',
  description: '발을 어깨너비로 벌리고 무릎을 90°까지 굽혔다 일어나세요',
  targetCount: 10,
  camera: 'full',
  initialState: 'up',
  category: '하체',
  hasFeedback: true,
};

const SQUAT_THRESHOLD = {
  UP_ANGLE: 160,
};

// 관절: 엉덩이(23), 무릎(25), 발목(27) — 왼쪽 기준
// 내려갈 때: 무릎 각도 < 100° → 'down'
// 올라올 때: 무릎 각도 > 160° → 카운트
export function detectSquat(landmarks, state, setCount, setState) {
  if (!isVisible(landmarks[26]) && !isVisible(landmarks[25])) return { angle: 0, feedback: 'no_pose' };

  const moveIdx = isVisible(landmarks[24]) ? 24 : 23; // Hip is highly moving
  if (!hasMovement(moveIdx, landmarks[moveIdx])) return { angle: 0, feedback: 'no_pose' };

  const T = SQUAT_FEEDBACK;

  const leftAngle = getAngle(
    smoothLandmark(24, landmarks[24]), // 화면상 왼쪽 (실제 RIGHT_HIP)
    smoothLandmark(26, landmarks[26]), // RIGHT_KNEE
    smoothLandmark(28, landmarks[28])  // RIGHT_ANKLE
  );
  const rightAngle = getAngle(
    smoothLandmark(23, landmarks[23]), // 화면상 오른쪽 (실제 LEFT_HIP)
    smoothLandmark(25, landmarks[25]), // LEFT_KNEE
    smoothLandmark(27, landmarks[27])  // LEFT_ANKLE
  );
  const angle = (leftAngle + rightAngle) / 2; // 양발 평균으로 안정성↑

  // 고관절 각도: 어깨(11)-엉덩이(23)-무릎(25)
  const leftHipAngle = getAngle(
    smoothLandmark(12, landmarks[12]), // RIGHT_SHOULDER
    smoothLandmark(24, landmarks[24]), // RIGHT_HIP
    smoothLandmark(26, landmarks[26])  // RIGHT_KNEE
  );
  const rightHipAngle = getAngle(
    smoothLandmark(11, landmarks[11]), // LEFT_SHOULDER
    smoothLandmark(23, landmarks[23]), // LEFT_HIP
    smoothLandmark(25, landmarks[25])  // LEFT_KNEE
  );
  const hipAngle = (leftHipAngle + rightHipAngle) / 2;

  // 발목 각도: 무릎(25)-발목(27)-발뒤꿈치(29)
  const leftAnkleAngle = getAngle(
    smoothLandmark(26, landmarks[26]), // RIGHT_KNEE
    smoothLandmark(28, landmarks[28]), // RIGHT_ANKLE
    smoothLandmark(30, landmarks[30])  // RIGHT_HEEL
  );
  const rightAnkleAngle = getAngle(
    smoothLandmark(25, landmarks[25]), // LEFT_KNEE
    smoothLandmark(27, landmarks[27]), // LEFT_ANKLE
    smoothLandmark(29, landmarks[29])  // LEFT_HEEL
  );
  const ankleAngle = (leftAnkleAngle + rightAnkleAngle) / 2;

  // 상태 감지
  if (isStateHeld('squat_down', angle < T.KNEE_DOWN_THRESHOLD, 4) && state === 'up') setState('down');
  else if (isStateHeld('squat_up', angle > SQUAT_THRESHOLD.UP_ANGLE, 4) && state === 'down') {
    setState('up');
    tryIncreaseCount(setCount);
  }

  // ── 폼 피드백 (AIHUB 데이터 분석 기반) ──
  let feedback = 'good';

  if (state === 'down') {
    // 1. 엉덩이하방오류: 무릎이 충분히 굽혀지지 않음 (p25: 정상=110, 오류=149)
    //    → down 진입했지만 실제 무릎 각도가 여전히 높으면 오류
    if (angle > T.KNEE_NOT_DEEP_ENOUGH) {
      feedback = 'not_deep';
    }
    // 2. 고관절오류: 상체가 앞으로 충분히 숙여지지 않음 (p25: 정상=95, 오류=130)
    //    → 고관절 각도가 너무 크면(상체 미굽힘) 오류
    else if (hipAngle > T.HIP_FORWARD_LEAN_OK) {
      feedback = 'lean_forward';
    }
    // 3. 발뒤꿈치오류: 발목 각도 이상 (p75: 정상=162, 발뒤꿈치=164+)
    //    → 발뒤꿈치가 들리면 발목 각도 분포가 달라짐
    else if (ankleAngle > T.ANKLE_HEEL_RISE_THRESHOLD) {
      feedback = 'heel_rise';
    }
  } else {
    // up 상태에서: 자세 준비 중
    feedback = state === 'up' ? 'ready' : 'good';
  }

  return { angle: Math.round(angle), feedback };
}

