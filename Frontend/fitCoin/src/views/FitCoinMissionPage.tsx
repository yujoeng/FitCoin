'use client';

import React, { useState } from 'react';
import {
  RefreshCw, Play, Check, Activity, Info,
} from 'lucide-react';
import type { MissionCandidate } from '@/types';
// 백드롭 페이드인 keyframe 주입 (한 번만, 브라우저 환경 체크)
if (typeof document !== 'undefined' && !document.getElementById('sq-demo-style')) {
  const st = document.createElement('style');
  st.id = 'sq-demo-style';
  st.textContent = `
    @keyframes sqDemoFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(st);
}



interface FitCoinMissionPageProps {
  candidates: MissionCandidate[];
  dailyMissionCount: number;
  onStart: (mission: MissionCandidate) => void;
  userLevel?: number; // 0: 초급, 1: 중급, 2: 고급
}

export default function FitCoinMissionPage({ candidates, dailyMissionCount, onStart, userLevel = 0 }: FitCoinMissionPageProps) {
  const [mission, setMission] = useState<MissionCandidate>(() => candidates[Math.floor(Math.random() * candidates.length)]);
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => {
      let next: MissionCandidate;
      do { next = candidates[Math.floor(Math.random() * candidates.length)]; }
      while (next.id === mission.id && candidates.length > 1);
      setMission(next);
      setSpinning(false);
    }, 380);
  };

  const isLocked = dailyMissionCount >= 3;
  const targetCount = mission.count[userLevel] ?? mission.count[0];

  return (
    <div className="fc-anim-fade" style={{ padding: '16px 16px 0' }}>
      {/* ── Daily Progress ── */}
      <div style={{ marginBottom: 16 }}>
        <div className="fc-section-label">오늘의 달성</div>
        <div className="fc-card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-2)' }}>
              {dailyMissionCount < 3 ? `${dailyMissionCount}/3 완료` : '오늘 모두 완료!'}
            </span>
            {dailyMissionCount >= 3
              ? <span className="fc-badge fc-badge-green"><Check size={12} /> 완료</span>
              : <span className="fc-badge">{3 - dailyMissionCount}회 남음</span>}
          </div>
          <div className="fc-seg-track">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`fc-seg${i < dailyMissionCount ? ' done' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mission Card ── */}
      {isLocked ? (
        <div className="fc-card fc-anim-scale">
          <div className="fc-locked-state">
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={28} color="var(--success)" strokeWidth={2.5} />
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-1)' }}>오늘 미션 완료</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.87rem', lineHeight: 1.6 }}>
              오늘은 충분히 운동했어요.<br />내일 다시 도전해 보세요.
            </div>
            <div className="fc-badge fc-badge-green">포인트 획득 완료</div>
          </div>
        </div>
      ) : (
        <div className="fc-card fc-anim-scale">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 16px 0' }}>
            <button className="fc-btn-icon" onClick={handleRefresh} title="다른 운동">
              <RefreshCw size={15} className={spinning ? 'fc-spin-once' : ''} />
            </button>
          </div>

          <div style={{ textAlign: 'center', padding: '20px 16px 16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 6, color: 'var(--text-1)' }}>
              {mission.name}
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.6, padding: '0 8px' }}>
              {mission.description}
            </p>
          </div>

          <div style={{ margin: '0 16px' }}>
            <div className="fc-card-alt" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Activity size={15} color="var(--text-3)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 600 }}>목표</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-1)' }}>
                {targetCount}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-3)', fontWeight: 600, marginLeft: 3 }}>
                  회
                </span>
              </span>
              <div className="fc-badge fc-badge-gold">
                {dailyMissionCount === 0 ? '1,000 P' : '500 P'}
              </div>
            </div>
          </div>



          <div style={{ padding: '12px 16px 16px' }}>
            <button
              className="fc-btn-primary"
              style={{ width: '100%' }}
              onClick={() => onStart(mission)}
            >
              <Play size={14} />
              바로 시작
            </button>
          </div>
        </div>
      )}

      {/* ── Mission Slots ── */}
      <div style={{ marginTop: 20 }}>
        <div className="fc-section-label">미션 슬롯</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[0, 1, 2].map((i) => {
            const isDone = i < dailyMissionCount;
            return (
              <div
                key={i}
                className="fc-card"
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  textAlign: 'center',
                  opacity: isDone ? 1 : 0.5,
                  position: 'relative',
                }}
              >
                {isDone ? (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: 6, left: 6, right: 6, bottom: 6,
                      border: '2px solid var(--color-primary)',
                      borderRadius: 10,
                      pointerEvents: 'none',
                    }} />
                    <div style={{
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: 'var(--color-primary)',
                      letterSpacing: 1,
                      border: '2px solid var(--color-primary)',
                      borderRadius: 4,
                      padding: '2px 4px',
                      display: 'inline-block',
                      marginBottom: 6,
                    }}>
                      FINISHED
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontWeight: 600 }}>
                      {i === 0 ? '1,000 P' : '500 P'}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: 32, height: 32,
                      borderRadius: '50%',
                      background: 'var(--surface-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 6px',
                      fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-3)',
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      {i === 0 ? '1,000 P' : '500 P'}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!isLocked && (
        <div className="fc-info-row" style={{ marginTop: 14 }}>
          <Info size={14} color="var(--text-3)" />
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
            체인지 버튼으로 다른 운동으로 바꿀 수 있어요
          </span>
        </div>
      )}
    </div>
  );
}
