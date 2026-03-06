// FitCoin - 공통 유틸리티

/**
 * 세 관절(a-b-c)의 각도를 계산 (b가 꼭짓점)
 */
export function getAngle(a, b, c) {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
}

/**
 * 두 랜드마크 간 유클리드 거리 (정규화 좌표)
 */
export function getDistance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * 상태 텍스트 한국어 변환
 */
export const STATE_LABELS = {
  // 공통
  up: "위",
  down: "아래",
  center: "중립",
  // 운동별
  tilted: "기울임",
  forward: "앞으로",
  open: "펼침",
  closed: "모음",
  bent: "꺾음",
};

/**
 * 자세 피드백 메시지 (AIHUB 크로스핏 데이터 분석 기반)
 * 에어스쿼트 기준 각도 임계값:
 *  - 정상: 무릎 p25=110°, 고관절 p25=95°
 *  - 고관절오류: down 상태 시 고관절 각도가 정상보다 25+ 높음 (상체 미굽힘)
 *  - 엉덩이하방오류: down 상태 도달 안됨 (무릎 각도가 충분히 꺾이지 않음)
 *  - 발뒤꿈치오류: 발목 각도 분포 패턴 차이
 */
export const SQUAT_FEEDBACK = {
  // down 상태 진입 임계값 (무릎 각도 < 이 값 → down)
  KNEE_DOWN_THRESHOLD: 100,
  // 엉덩이하방오류: 무릎을 충분히 굽히지 않음 (정상 p25=110 vs 엉덩이오류 p25=149)
  KNEE_NOT_DEEP_ENOUGH: 145,
  // 고관절오류: down 상태에서 고관절이 너무 펴짐 (정상 p25=95 vs 고관절오류 p25=130)
  HIP_FORWARD_LEAN_OK: 125,
  // 발뒤꿈치오류: down 상태에서 발목 각도가 정상보다 klinkern (정상 p25=143, 발뒤꿈치 p25=143 비슷, p75=164 vs 162)
  ANKLE_HEEL_RISE_THRESHOLD: 165,
};

export const FEEDBACK_MESSAGES = {
  good: { emoji: "✅", text: "자세 좋아요!", color: "good" },
  not_deep: { emoji: "⬇️", text: "조금 더 내려가세요!", color: "warn" },
  lean_forward: { emoji: "📐", text: "상체를 더 숙여보세요!", color: "warn" },
  heel_rise: { emoji: "🦶", text: "발뒤꿈치가 들렸어요!", color: "warn" },
  ready: { emoji: "🐾", text: "준비 자세", color: "neutral" },
  no_pose: { emoji: "📷", text: "포즈를 감지 중...", color: "neutral" },
};
