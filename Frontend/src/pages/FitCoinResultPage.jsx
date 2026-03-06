import React, { useEffect, useState } from 'react';
import {
  CheckCircle, Home, ChevronRight, Trophy, Coins, Zap, Star
} from 'lucide-react';

// 컨페티 (CSS 애니메이션 기반, 색상 점만 사용)
const CONFETTI_COLORS = ['#FF9F73', '#9B80E8', '#3EBC7A', '#F4A900', '#F26B6B', '#2D8FF5'];
function Confetti({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: -12, left: `${5 + i * 4.8}%`,
          width: i % 3 === 0 ? 8 : 6, height: i % 3 === 0 ? 8 : 6,
          borderRadius: i % 2 === 0 ? '50%' : '2px',
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animation: `confetti ${1.2 + (i % 5) * 0.2}s ${(i % 6) * 0.12}s ease-out both`,
        }} />
      ))}
    </div>
  );
}

export default function FitCoinResultPage({ mission, missionCount, earnedPoint, totalPoints, streak, onNext, onHome }) {
  const [visible, setVisible] = useState(false);
  const isAllDone = missionCount >= 3;
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  // 운동 완료 후가 아닌 탭 직접 클릭 시 처리
  if (!mission) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Trophy size={24} color="var(--text-3)" />
        </div>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)', marginBottom: 6 }}>아직 완료한 미션이 없어요</div>
        <div style={{ fontSize: '0.83rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
          홈에서 운동을 시작하면<br />완료 후 결과를 볼 수 있어요
        </div>
        <button className="fc-btn-primary" style={{ marginTop: 20 }} onClick={onHome}>
          <Home size={14} /> 홈으로
        </button>
      </div>
    );
  }


  return (
    <div style={{ position: 'relative' }}>
      <Confetti active={visible && isAllDone} />

      {/* ── Hero ── */}
      <div className="fc-result-hero fc-anim-scale">
        <div className="fc-result-icon" style={{
          background: isAllDone
            ? 'linear-gradient(135deg, var(--gold), #FFD166)'
            : 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        }}>
          {isAllDone
            ? <Trophy size={32} color="white" strokeWidth={2} />
            : <CheckCircle size={32} color="white" strokeWidth={2} />}
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-1)', marginBottom: 4 }}>
          {isAllDone ? '모두 완료!' : '미션 완료!'}
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.88rem', fontWeight: 500 }}>{mission.name} 달성</p>
      </div>

      {/* ── Points ── */}
      <div className="fc-card fc-anim-fade" style={{ padding: '20px 16px', marginBottom: 10 }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
          획득 포인트
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <Coins size={24} color="var(--gold)" />
          <span className="fc-result-points">+{earnedPoint.toLocaleString()}</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-3)', fontWeight: 600 }}>P</span>
        </div>
        {missionCount === 1 && (
          <div className="fc-badge fc-badge-gold" style={{ marginBottom: 10 }}>
            <Star size={11} fill="currentColor" />
            첫 미션 보너스 적용
          </div>
        )}
        <div className="fc-divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>누적 포인트</span>
          <span style={{ fontWeight: 800, color: 'var(--text-1)' }}>{totalPoints.toLocaleString()} P</span>
        </div>
      </div>

      {/* ── Mission Progress ── */}
      <div className="fc-card fc-anim-fade" style={{ padding: '14px 16px', marginBottom: 10 }}>
        <div className="fc-section-label">오늘의 달성</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-2)' }}>
            {missionCount}/3
          </span>
          {isAllDone && <span className="fc-badge fc-badge-green"><CheckCircle size={11} /> 완료</span>}
        </div>
        <div className="fc-seg-track">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`fc-seg${i < missionCount ? ' done' : ''}`} />
          ))}
        </div>
        {!isAllDone && (
          <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-3)' }}>
            {3 - missionCount}회 더 완료하면 하루 목표 달성!
          </p>
        )}
      </div>

      {/* ── Streak ── */}
      <div className="fc-card fc-anim-fade" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="fc-icon-box" style={{ background: 'rgba(224,120,69,0.10)', borderRadius: 10 }}>
            <Zap size={18} color="var(--primary-dark)" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>데일리 스트릭</div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-1)' }}>
              {streak.count}일 연속
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="fc-btn-row">
        <button className="fc-btn-ghost" onClick={onHome}>
          <Home size={15} />
          홈
        </button>
        {!isAllDone && (
          <button className="fc-btn-primary" onClick={onNext}>
            다음 미션
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
