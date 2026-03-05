// ── useAICoach: LangChain 백엔드 호출 훅 ──
import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_AI_COACH_URL || 'http://localhost:8000';

/**
 * 운동 이력을 백엔드에 전송해 AI 추천을 받습니다.
 * @returns {{ recommendation, loading, error, fetchRecommendation }}
 */
export function useAICoach() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendation = useCallback(async (history) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
      });
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const data = await res.json();
      setRecommendation(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { recommendation, loading, error, fetchRecommendation };
}
