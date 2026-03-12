// ── useAICoach: AI 코치 추천 훅 ──
'use client';

import { useState, useCallback } from 'react';
import type { AIRecommendation, HistoryEntry } from '@/types';

const API_URL =
  process.env.NEXT_PUBLIC_AI_COACH_URL || 'http://localhost:8000';

interface UseAICoachReturn {
  recommendation: AIRecommendation | null;
  loading: boolean;
  error: string | null;
  fetchRecommendation: (history: HistoryEntry[]) => Promise<void>;
}

export function useAICoach(): UseAICoachReturn {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = useCallback(async (history: HistoryEntry[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
      });
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const data = await res.json() as AIRecommendation;
      setRecommendation(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  return { recommendation, loading, error, fetchRecommendation };
}
