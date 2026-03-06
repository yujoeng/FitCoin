// ── useFitCoinStorage: localStorage 기반 상태 관리 훅 ──

const todayKey = () => `fitcoin_day_${new Date().toISOString().slice(0, 10)}`;
const STREAK_KEY  = 'fitcoin_streak';
const POINTS_KEY  = 'fitcoin_total_points';
const HISTORY_KEY = 'fitcoin_history'; // AI 코치용 운동 이력

// ── Daily State ──
export function loadDailyState() {
  try {
    const raw = localStorage.getItem(todayKey());
    return raw ? JSON.parse(raw) : { missionCount: 0 };
  } catch { return { missionCount: 0 }; }
}
export function saveDailyState(state) {
  localStorage.setItem(todayKey(), JSON.stringify(state));
}

// ── Streak ──
export function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: '' }; }
  catch { return { count: 0, lastDate: '' }; }
}
export function updateStreak() {
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak    = loadStreak();
  if (streak.lastDate === today) return streak;
  const newCount  = streak.lastDate === yesterday ? streak.count + 1 : 1;
  const newStreak = { count: newCount, lastDate: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  return newStreak;
}

// ── Points ──
export function loadTotalPoints() {
  return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10);
}
export function addPoints(amount) {
  const prev = loadTotalPoints();
  localStorage.setItem(POINTS_KEY, String(prev + amount));
  return prev + amount;
}

// ── Workout History (AI Coach용) ──
export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

/**
 * 운동 이력 추가
 * @param {string} exerciseId
 * @param {string} exerciseName
 * @param {number} count
 * @param {string} category
 * @param {string[]} feedbackKeys - 감지된 오류 목록
 */
export function addHistoryEntry({ exerciseId, exerciseName, count, category, feedbackKeys = [] }) {
  const history = loadHistory();
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    exerciseId,
    exerciseName,
    count,
    category,
    feedbackKeys, // e.g. ['heel_rise', 'good']
  };
  // 최근 50건만 유지
  const updated = [entry, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}
