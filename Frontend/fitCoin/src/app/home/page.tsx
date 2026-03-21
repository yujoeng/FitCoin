"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeView from "@/views/HomeView";
import { DEFAULT_ROOM_CONFIG } from "@/data/roomThemes";
import type { HomePageState, StreakDay } from "@/types/home";
import { getRoomLayout } from "@/features/room/services/roomApi";
import { convertLayoutToRoomConfig } from "@/features/room/hooks/useRoom";

import {
  useAds,
  AdConfirmModal,
  AdAlreadyWatchedModal,
  AdPlayer,
  AdExitModal,
  AdRewardModal,
} from "@/features/ads";

// ─── 임시 스트릭 mock 데이터 생성 ───
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
  const [homeState, setHomeState] = useState<HomePageState>(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // 1. 방 데이터 최신화 (visibilitychange 대응)
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        const res = await getRoomLayout();
        if (res.isSuccess && res.result) {
          setHomeState(prev => ({
            ...prev,
            roomConfig: convertLayoutToRoomConfig(res.result)
          }));
        }
      }
    };

    // 진입 시 초기 로드
    handleVisibility();

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

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
        onEditRoom={() => router.push("/room")}
        onWatchAd={handleAdButtonClick}
        onGoExchange={() => router.push("/exchange")}
        onGoStore={() => router.push("/store")}
        onGoSettings={() => router.push("/settings")}
        onViewCalendar={() => router.push("/my")}
      />

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