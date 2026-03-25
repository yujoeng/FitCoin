// src/features/streak/hooks/useRecentStreak.ts
// ─────────────────────────────────────────────
// 최근 7일 스트릭 조회 훅
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import type { StreakDay } from "@/types/home";
import { getRecentStreak } from "../features/streak/services/streakApi";
import { mapToStreakDays } from "../utils/streakMapper";

interface UseRecentStreakResult {
  streakCount: number;
  streakDays: StreakDay[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useRecentStreak(): UseRecentStreakResult {
  const [streakCount, setStreakCount] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<StreakDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecentStreak();
        if (cancelled) return;
        setStreakCount(data.currentStreak);
        setStreakDays(mapToStreakDays(data.weeklyStreak));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error("스트릭 조회 실패"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);

  return { streakCount, streakDays, isLoading, error, refetch };
}
