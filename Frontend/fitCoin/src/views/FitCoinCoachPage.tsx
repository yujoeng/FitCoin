'use client';

import React, { useEffect, useState } from 'react';
import {
  Brain, RefreshCw, CheckCircle, AlertTriangle,
  Dumbbell, Calendar, WifiOff,
} from 'lucide-react';
import { useAICoach } from '@/hooks/useAICoach';
import { loadHistory } from '@/utils/fitcoinStorage';
import type { AIRecommendation, HistoryEntry } from '@/types';

// 피드백 키 → 한국어 라벨
const FEEDBACK_LABEL: Record<string, string> = {
  good: '자세 좋음', not_deep: '더 내려가야 함',
  lean_forward: '상체 미굽힘', heel_rise: '발뒤꿈치 들림',
  ready: '준비 자세', no_pose: '감지 안됨',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function RecommendCard({ rec }: { rec: AIRecommendation }) {
  const { comment, recommendations = [] } = rec;
  return (
    <div className="fc-card" style={{ padding: '16px 16px', marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div className="fc-icon-box" style={{ background: 'rgba(155,128,232,0.12)', borderRadius: 10, width: 36, height: 36 }}>
          <Brain size={18} color="var(--accent)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            AI 코치 메시지
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-1)', fontWeight: 600, lineHeight: 1.6 }}>
            {comment}
          </p>
        </div>
      </div>
      <div className="fc-section-label">오늘의 추천 운동</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {recommendations.map((ex, i) => (
          <div key={i} className="fc-list-item" style={{ borderRadius: 'var(--r-sm)', border: '1px solid var(--card-border)', cursor: 'default' }}>
            <div className="fc-icon-box" style={{ width: 36, height: 36, borderRadius: 8, background: `hsl(${i * 80 + 220}, 60%, 94%)` }}>
              <Dumbbell size={16} color={`hsl(${i * 80 + 220}, 45%, 40%)`} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-1)' }}>{ex.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{ex.reason}</div>
            </div>
            <span className="fc-badge">{ex.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryItem({ entry }: { entry: HistoryEntry }) {
  const hasWarning = entry.feedbackKeys.some(k => k !== 'good' && k !== 'ready' && k !== 'no_pose');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--card-border)' }}>
      <div className="fc-icon-box" style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-2)' }}>
        {hasWarning
          ? <AlertTriangle size={15} color="var(--warning)" />
          : <CheckCircle size={15} color="var(--success)" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.exerciseName}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
          {entry.feedbackKeys.slice(0, 2).map(k => FEEDBACK_LABEL[k] ?? k).join(' · ')}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-2)' }}>{entry.count}회</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>
          <Calendar size={9} style={{ display: 'inline', marginRight: 2 }} />
          {formatDate(entry.date)}
        </div>
      </div>
    </div>
  );
}

export default function FitCoinCoachPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { recommendation, loading, error, fetchRecommendation } = useAICoach();

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleFetch = () => fetchRecommendation(history.slice(0, 20));
  const isEmpty = history.length === 0;

  return (
    <div className="fc-anim-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-1)' }}>AI 코치</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 500 }}>운동 이력 기반 맞춤 추천</div>
        </div>
        <button
          className="fc-btn-primary"
          style={{ padding: '9px 16px', fontSize: '0.85rem' }}
          onClick={handleFetch}
          disabled={loading || isEmpty}
        >
          {loading ? <RefreshCw size={14} className="fc-pulse" /> : <Brain size={14} />}
          {loading ? '분석 중...' : '추천 받기'}
        </button>
      </div>

      {error && (
        <div className="fc-info-row fc-badge-warn" style={{ marginBottom: 12, gap: 8 }}>
          <WifiOff size={14} color="var(--warning)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>
            AI 코치 서버에 연결할 수 없어요.{' '}
            <code style={{ fontSize: '0.75rem', background: 'var(--surface-3)', padding: '1px 5px', borderRadius: 4 }}>
              ai_coach/ 폴더 README 참고
            </code>
          </span>
        </div>
      )}

      {recommendation && <RecommendCard rec={recommendation} />}

      {isEmpty ? (
        <div className="fc-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Dumbbell size={24} color="var(--text-3)" />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)', marginBottom: 6 }}>아직 운동 이력이 없어요</div>
          <div style={{ fontSize: '0.83rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
            홈에서 운동을 완료하면<br />AI가 맞춤 추천을 드려요
          </div>
        </div>
      ) : (
        <div className="fc-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="fc-section-label" style={{ marginBottom: 0 }}>최근 운동 이력</div>
            <span className="fc-badge">{history.length}건</span>
          </div>
          {history.slice(0, 15).map((entry) => (
            <HistoryItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
