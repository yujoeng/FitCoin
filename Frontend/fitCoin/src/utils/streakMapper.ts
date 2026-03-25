// src/features/streak/utils/streakMapper.ts
// ─────────────────────────────────────────────
// API 응답(RecentStreakResponse) → HomePageState의 StreakDay[] 변환 유틸
// ─────────────────────────────────────────────

import type { StreakDay, StreakDayStatus } from "@/types/home";
import type { StreakItem } from "../features/streak/services/streakApi";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * API 응답의 StreakItem 배열 → StreakDay 배열 변환
 * - 오늘 날짜 기준으로 status 결정
 * - done: 출석 완료
 * - missed: 미출석 (과거)
 * - today: 오늘 (미출석)
 * - future: 미래 (아직 오지 않은 날)
 */
export function mapToStreakDays(weeklyStreak: StreakItem[]): StreakDay[] {
  const todayStr = new Date().toISOString().slice(0, 10); // "2026-03-24"

  return weeklyStreak.map((item) => {
    const date = new Date(item.date);
    const label = DAY_LABELS[date.getDay()];

    let status: StreakDayStatus;

    if (item.date === todayStr) {
      status = item.checked ? "done" : "today";
    } else if (item.date > todayStr) {
      status = "future";
    } else {
      status = item.checked ? "done" : "missed";
    }

    return { label, status };
  });
}
