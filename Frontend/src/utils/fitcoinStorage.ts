// ── fitcoinStorage: LocalStorage 유틸리티 ──
import type { DailyState, HistoryEntry, StreakState } from '@/types';

const KEY_DAILY   = 'fitcoin_daily';
const KEY_STREAK  = 'fitcoin_streak';
const KEY_POINTS  = 'fitcoin_points';
const KEY_HISTORY = 'fitcoin_history';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Daily State ──
export function loadDailyState(): DailyState {
  try {
    const raw = localStorage.getItem(KEY_DAILY);
    if (!raw) return { missionCount: 0 };
    const data = JSON.parse(raw) as { date: string; missionCount: number };
    if (data.date !== today()) return { missionCount: 0 };
    return { missionCount: data.missionCount };
  } catch {
    return { missionCount: 0 };
  }
}

export function saveDailyState(state: DailyState): void {
  localStorage.setItem(KEY_DAILY, JSON.stringify({ date: today(), ...state }));
}

// ── Streak ──
export function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem(KEY_STREAK);
    if (!raw) return { count: 0, lastDate: '' };
    return JSON.parse(raw) as StreakState;
  } catch {
    return { count: 0, lastDate: '' };
  }
}

export function updateStreak(): StreakState {
  const prev = loadStreak();
  const t = today();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak: StreakState = {
    count: prev.lastDate === yesterday ? prev.count + 1 : 1,
    lastDate: t,
  };
  localStorage.setItem(KEY_STREAK, JSON.stringify(newStreak));
  return newStreak;
}

// ── Points ──
export function loadTotalPoints(): number {
  return parseInt(localStorage.getItem(KEY_POINTS) ?? '0', 10);
}

export function addPoints(amount: number): number {
  const next = loadTotalPoints() + amount;
  localStorage.setItem(KEY_POINTS, String(next));
  return next;
}

// ── History ──
export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'date'>): void {
  const history = loadHistory();
  const newEntry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: new Date().toISOString(),
    ...entry,
  };
  history.unshift(newEntry);
  if (history.length > 100) history.splice(100);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(history));
}
