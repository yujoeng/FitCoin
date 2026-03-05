import React, { useState, useEffect } from 'react';
import {
  RefreshCw, Play, ChevronRight, Check, Lock,
  Dumbbell, Activity, Heart, Zap, MoveVertical, User,
  RotateCcw, ArrowUp, Info, Camera, Eye,
} from 'lucide-react';
import ExerciseDemoModal from '../components/ExerciseDemoModal';

// 백드롭 페이드인 keyframe 주입 (한 번만)
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

// 카테고리 정보
const CATEGORY_STYLE = {
  '하체':    { color: '#7B5CE8', bg: 'rgba(123,92,232,0.08)',  border: 'rgba(123,92,232,0.18)', Icon: MoveVertical },
  '팔':      { color: '#2D8FF5', bg: 'rgba(45,143,245,0.08)',  border: 'rgba(45,143,245,0.18)', Icon: Activity    },
  '코어':    { color: '#1E9E60', bg: 'rgba(30,158,96,0.08)',   border: 'rgba(30,158,96,0.18)',  Icon: Zap         },
  '어깨':    { color: '#C07A00', bg: 'rgba(192,122,0,0.08)',   border: 'rgba(192,122,0,0.18)',  Icon: Dumbbell    },
  '유산소':  { color: '#D94E4E', bg: 'rgba(217,78,78,0.08)',   border: 'rgba(217,78,78,0.18)',  Icon: Heart       },
  '스트레칭':{ color: '#1A8EA8', bg: 'rgba(26,142,168,0.08)',  border: 'rgba(26,142,168,0.18)', Icon: User        },
};

// 운동 이이콘 매핑 (Lucide 아이콘 이름 → 컴포넌트)
const ICON_MAP = {
  PersonStanding: User, MoveVertical, AlignHorizontalJustifyCenter: Dumbbell,
  ArrowUpFromLine: ArrowUp, MoveUp: ArrowUp, RefreshCw, Dumbbell,
  ArrowUpToLine: ArrowUp, ChevronsUp: ArrowUp, ArrowLeftRight: Activity,
  ArrowUpDown: MoveVertical, MoveHorizontal: Activity, Expand: Activity, Hand: Heart,
};

export default function FitCoinMissionPage({ exercises, dailyMissionCount, onStart }) {
  const [mission, setMission] = useState(() => exercises[Math.floor(Math.random() * exercises.length)]);
  const [spinning, setSpinning] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => {
      let next;
      do { next = exercises[Math.floor(Math.random() * exercises.length)]; }
      while (next.id === mission.id && exercises.length > 1);
      setMission(next);
      setSpinning(false);
    }, 380);
  };

  const isLocked = dailyMissionCount >= 3;
  const cat = CATEGORY_STYLE[mission.category] || CATEGORY_STYLE['스트레칭'];
  const ExIcon = ICON_MAP[mission.icon] ?? Dumbbell;
  const CatIcon = cat.Icon;

  return (
    <div className="fc-anim-fade">

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
          {/* Segmented progress */}
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
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={28} color="var(--success)" strokeWidth={2.5} />
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-1)' }}>
              오늘 미션 완료
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.87rem', lineHeight: 1.6 }}>
              오늘은 충분히 운동했어요.<br />내일 다시 도전해 보세요.
            </div>
            <div className="fc-badge fc-badge-green">포인트 획득 완료</div>
          </div>
        </div>
      ) : (
        <div className="fc-card fc-anim-scale">

          {/* Category + refresh */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 0' }}>
            <span className="fc-cat-tag" style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color }}>
              <CatIcon size={12} strokeWidth={2.5} />
              {mission.category}
            </span>
            <button className="fc-btn-icon" onClick={handleRefresh} title="다른 운동">
              <RefreshCw size={15} className={spinning ? 'fc-spin-once' : ''} />
            </button>
          </div>

          {/* Exercise icon + name */}
          <div style={{ textAlign: 'center', padding: '20px 16px 16px' }}>
            <div className="fc-ex-icon" style={{ background: cat.bg, border: `1.5px solid ${cat.border}`, marginBottom: 14 }}>
              <ExIcon size={36} color={cat.color} strokeWidth={1.8} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 6, color: 'var(--text-1)' }}>
              {mission.name}
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.6, padding: '0 8px' }}>
              {mission.description}
            </p>
          </div>

          {/* Target info */}
          <div style={{ margin: '0 16px' }}>
            <div className="fc-card-alt" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Activity size={15} color="var(--text-3)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 600 }}>목표</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-1)' }}>
                {mission.targetCount}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-3)', fontWeight: 600, marginLeft: 3 }}>
                  {mission.id === 'plank' ? '세트' : '회'}
                </span>
              </span>
              <div className="fc-badge fc-badge-gold">
                {dailyMissionCount === 0 ? '1,000 P' : '500 P'}
              </div>
            </div>
          </div>

          {/* Camera hint */}
          <div className="fc-camera-hint" style={{ margin: '10px 16px' }}>
            <Camera size={14} strokeWidth={2} />
            <span>{mission.camera === 'full' ? '전신이 보이도록 카메라를 배치해 주세요' : '상체만 보여도 됩니다'}</span>
          </div>

          {/* Buttons */}
          <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* 동작 미리보기 */}
            <button
              className="fc-btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #7b5ce8 0%, #9b6cf8 100%)' }}
              onClick={() => setShowDemo(true)}
            >
              <Eye size={15} />
              동작 미리보기
            </button>
            {/* 바로 시작 */}
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '11px 0', borderRadius: 12, border: '1.5px solid var(--card-border)',
                background: 'transparent', color: 'var(--text-2)', fontSize: '0.88rem',
                fontWeight: 700, cursor: 'pointer',
              }}
              onClick={() => onStart(mission)}
            >
              <Play size={14} />
              바로 시작
            </button>
          </div>
        </div>
      )}

      {/* Tip */}
      {!isLocked && (
        <div className="fc-info-row" style={{ marginTop: 14 }}>
          <Info size={14} color="var(--text-3)" />
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
            체인지 버튼으로 다른 운동으로 바꿀 수 있어요
          </span>
        </div>
      )}

      {/* 3D 동작 미리보기 모달 */}
      {showDemo && (
        <ExerciseDemoModal
          exercise={mission}
          onStart={() => { setShowDemo(false); onStart(mission); }}
          onClose={() => setShowDemo(false)}
        />
      )}
    </div>
  );
}
