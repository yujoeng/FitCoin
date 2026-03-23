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
 * 두 랜드마크 간 X축 거리 (절댓값)
 */
export function getDistanceX(a, b) {
  return Math.abs(a.x - b.x);
}

/**
 * 두 랜드마크 간 Y축 거리 (절댓값)
 */
export function getDistanceY(a, b) {
  return Math.abs(a.y - b.y);
}

/**
 * 두 랜드마크 사이의 중점 좌표 계산
 */
export function getCenterPoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
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

// ─────────────────────────────────────────
// [고도화] 랜드마크 스무딩 (노이즈 제거)
// ─────────────────────────────────────────

const _landmarkBuffer = {};
const BUFFER_SIZE = 5;

export function smoothLandmark(index, raw) {
  if (!_landmarkBuffer[index]) _landmarkBuffer[index] = [];
  const buf = _landmarkBuffer[index];
  buf.push({ x: raw.x, y: raw.y, z: raw.z ?? 0 });
  if (buf.length > BUFFER_SIZE) buf.shift();
  const avg = buf.reduce(
    (acc, cur) => ({ x: acc.x + cur.x, y: acc.y + cur.y, z: acc.z + cur.z }),
    { x: 0, y: 0, z: 0 }
  );
  return { x: avg.x / buf.length, y: avg.y / buf.length, z: avg.z / buf.length };
}

export function resetSmoothingBuffer() {
  Object.keys(_landmarkBuffer).forEach((k) => delete _landmarkBuffer[k]);
}

// ─────────────────────────────────────────
// [고도화] 카운트 쿨다운 (중복 인식 방지)
// ─────────────────────────────────────────

let _lastCountTime = 0;
const COUNT_COOLDOWN_MS = 800;

export function tryIncreaseCount(setCount) {
  const now = Date.now();
  if (now - _lastCountTime < COUNT_COOLDOWN_MS) return false;
  _lastCountTime = now;
  setCount((p) => p + 1);
  return true;
}

export function resetCooldown() {
  _lastCountTime = 0;
}

export function resetDetectionState() {
  resetSmoothingBuffer();
  resetCooldown();
}

// ─────────────────────────────────────────
// [고도화] 랜드마크 visibility 체크
// ─────────────────────────────────────────

const VISIBILITY_THRESHOLD = 0.5;

export function isVisible(...landmarks) {
  return landmarks.every(
    (lm) => lm && (lm.visibility ?? 1) >= VISIBILITY_THRESHOLD
  );
}
