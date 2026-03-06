// ── AppShell: TopBar + TabBar UI 컴포넌트 ──
import React from 'react';
import { Zap, ChevronLeft, Home, Activity, Trophy, Coins, Brain } from 'lucide-react';

// ── 상단 헤더바 ──
export function AppTopBar({ page, mission, streak, totalPoints, onBack }) {
  const isHome = page === 'mission';

  return (
    <header className="fc-topbar">
      {/* 왼쪽: 로고 or 뒤로가기 */}
      {isHome ? (
        <div className="fc-topbar-logo">
          <div className="fc-topbar-icon">
            <Zap size={18} color="white" fill="white" />
          </div>
          <span className="fc-topbar-title">FitCoin</span>
        </div>
      ) : (
        <button className="fc-btn-icon" onClick={onBack}>
          <ChevronLeft size={18} />
        </button>
      )}

      {/* 운동 중일 때 미션명 */}
      {!isHome && mission && (
        <span style={{ flex: 1, fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)', marginLeft: 8 }}>
          {mission.name}
        </span>
      )}

      {/* 오른쪽: 스탯 칩 */}
      <div className="fc-topbar-right">
        {isHome && (
          <div className="fc-chip">
            <Activity size={12} color="var(--primary-dark)" />
            <span style={{ color: 'var(--primary-dark)' }}>{streak.count}일</span>
          </div>
        )}
        <div className="fc-chip">
          <Coins size={12} color="var(--gold)" />
          <span style={{ color: 'var(--gold)' }}>{totalPoints.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
}

// ── 하단 탭바 ──
const TABS = [
  { key: 'mission', label: '홈',    Icon: Home     },
  { key: 'exercise', label: '운동', Icon: Activity },
  { key: 'coach',   label: 'AI 코치', Icon: Brain  },
  { key: 'result',  label: '결과',  Icon: Trophy   },
];

export function AppTabBar({ active, onNavigate }) {
  return (
    <nav className="fc-tabbar">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={`fc-tab${active === key ? ' active' : ''}`}
          onClick={() => onNavigate(key === 'exercise' ? 'mission' : key)}
        >
          <Icon size={20} strokeWidth={active === key ? 2.5 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
