"use client";

// ── AppShell: TopBar + TabBar UI 컴포넌트 ──
import React from "react";
import {
  Zap,
  ChevronLeft,
  Home,
  Activity,
  Trophy,
  Coins,
  Brain,
  BookOpen,
  BookMarked,
  Wallet,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import type { Exercise, StreakState } from "@/types";

// ── 상단 헤더바 ──
interface AppTopBarProps {
  page: string;
  mission: Exercise | null;
  streak: StreakState;
  totalPoints: number;
  onBack: () => void;
}

export function AppTopBar({
  page,
  mission,
  streak,
  totalPoints,
  onBack,
}: AppTopBarProps) {
  const isHome = page === "mission";

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
        <span
          style={{
            flex: 1,
            fontWeight: 800,
            fontSize: "1rem",
            color: "var(--text-1)",
            marginLeft: 8,
          }}
        >
          {mission.name}
        </span>
      )}

      {/* 오른쪽: 스탯 칩 */}
      <div className="fc-topbar-right">
        {isHome && (
          <div className="fc-chip">
            <Activity size={12} color="var(--primary-dark)" />
            <span style={{ color: "var(--primary-dark)" }}>
              {streak.count}일
            </span>
          </div>
        )}
        <div className="fc-chip">
          <Coins size={12} color="var(--gold)" />
          <span style={{ color: "var(--gold)" }}>
            {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}

// ── 하단 탭바 ──
const TABS = [
  {
    key: "character",
    label: "캐릭터",
    Icon: BookOpen,
    href: "/character",
  },
  { key: "room", label: "테마/가구", Icon: BookMarked, href: "/room" },
  { key: "home", label: "홈", Icon: Home, href: "/home" },
  { key: "wallet", label: "지갑", Icon: Wallet, href: "/wallet" },
  { key: "my", label: "마이페이지", Icon: Settings, href: "/my" },
];

interface AppTabBarProps {
  active?: string; // 더 이상 필수 아님, usePathname으로 자동 감지
}

export function AppTabBar({ active }: AppTabBarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fc-tabbar">
      {TABS.map(({ key, label, Icon, href }) => {
        const isActive = active ? active === key : pathname?.startsWith(href);
        return (
          <button
            key={key}
            className={`fc-tab${isActive ? " active" : ""}`}
            onClick={() => router.push(href)}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ whiteSpace: "pre-line" }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
