import { getAngle, SQUAT_FEEDBACK } from './fitcoinUtils';

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

// 관절: 엉덩이(23), 무릎(25), 발목(27) — 왼쪽 기준
// 내려갈 때: 무릎 각도 < 100° → 'down'
// 올라올 때: 무릎 각도 > 160° → 카운트
export function detectSquat(landmarks, state, setCount, setState) {
  const T = SQUAT_FEEDBACK;

  const leftAngle = getAngle(landmarks[23], landmarks[25], landmarks[27]);
  const rightAngle = getAngle(landmarks[24], landmarks[26], landmarks[28]);
  const angle = (leftAngle + rightAngle) / 2; // 양발 평균으로 안정성↑

  // 고관절 각도: 어깨(11)-엉덩이(23)-무릎(25)
  const leftHipAngle = getAngle(landmarks[11], landmarks[23], landmarks[25]);
  const rightHipAngle = getAngle(landmarks[12], landmarks[24], landmarks[26]);
  const hipAngle = (leftHipAngle + rightHipAngle) / 2;

  // 발목 각도: 무릎(25)-발목(27)-발뒤꿈치(29)
  const leftAnkleAngle = getAngle(landmarks[25], landmarks[27], landmarks[29]);
  const rightAnkleAngle = getAngle(landmarks[26], landmarks[28], landmarks[30]);
  const ankleAngle = (leftAnkleAngle + rightAnkleAngle) / 2;

  // 상태 감지
  if (angle < T.KNEE_DOWN_THRESHOLD && state === 'up') setState('down');
  else if (angle > 160 && state === 'down') {
    setState('up');
    setCount((p) => p + 1);
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

