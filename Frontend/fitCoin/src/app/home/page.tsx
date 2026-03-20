"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeView from "@/views/HomeView";
import { DEFAULT_ROOM_CONFIG } from "@/data/roomThemes";
import type { HomePageState, StreakDay } from "@/types/home";

import {
  useAds,
  AdConfirmModal,
  AdAlreadyWatchedModal,
  AdPlayer,
  AdExitModal,
  AdRewardModal,
} from "@/features/ads";

// ─── 임시 스트릭 mock 데이터 생성 ───
// TODO: 백엔드 API 연결 후 제거
function createMockStreakDays(): StreakDay[] {
  const labels = ["월", "화", "수", "목", "금", "토", "일"];
  const statuses: StreakDay["status"][] = [
    "done",
    "done",
    "done",
    "done",
    "today",
    "future",
    "future",
  ];
  return labels.map((label, i) => ({ label, status: statuses[i] }));
}

// ─── 초기 상태 mock ───
// TODO: 백엔드 API 연결 후 서버에서 받아온 데이터로 교체
const INITIAL_STATE: HomePageState = {
  points: 3500,
  coins: 2,
  streakCount: 4,
  streakDays: createMockStreakDays(),
  character: {
    id: "user-char-01",
    characterTypeId: "강아지",
    name: "강아지",
    exp: 4,
    stage: 2,
    imageSrc: "/characters/before/강아지.png",
  },
  roomConfig: DEFAULT_ROOM_CONFIG,
};

export default function HomePage() {
  const router = useRouter();

  // TODO: FitCoinApp.tsx 완성 후 이 state를 위로 올리고 props로 받기
  const [homeState, setHomeState] = useState<HomePageState>(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // ── 마운트 여부 확인 ──
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── 광고 기능 훅 연동 ──
  const {
    step,
    adUrl,
    isLoading,
    handleAdButtonClick,
    handleConfirmYes,
    handleConfirmNo,
    handleAlreadyWatchedClose,
    handleExitRequest,
    handleExitConfirm,
    handleExitCancel,
    handleVideoEnded,
    handleRewardClose,
  } = useAds();

  // 하이드레이션 완료 전에는 서버와 동일한 초기 UI를 유지하거나 로딩 상태 표시
  if (!isMounted) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }} />
    );
  }

  return (
    <>
      <HomeView
        state={homeState}
        onGoMission={() => router.push("/missions")}
        onEditRoom={() => router.push("/room-edit")}
        onWatchAd={handleAdButtonClick}
        onGoExchange={() => router.push("/exchange")}
        onGoStore={() => router.push("/store")}
        onGoSettings={() => router.push("/settings")}
        onViewCalendar={() => router.push("/my")}
      />

      {/* ── 광고 관련 모달들 ── */}
      <AdConfirmModal
        isOpen={step === "confirm"}
        isLoading={isLoading}
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
      />
      <AdAlreadyWatchedModal
        isOpen={step === "already-watched"}
        onClose={handleAlreadyWatchedClose}
      />
      <AdPlayer
        isOpen={step === "playing"}
        adUrl={adUrl}
        onEnded={handleVideoEnded}
        onExitRequest={handleExitRequest}
      />
      <AdExitModal
        isOpen={step === "exit-confirm"}
        onExitConfirm={handleExitConfirm}
        onExitCancel={handleExitCancel}
      />
      <AdRewardModal isOpen={step === "reward"} onClose={handleRewardClose} />
    </>
  );
}