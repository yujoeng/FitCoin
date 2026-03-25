"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeView from "@/views/HomeView";
import { DEFAULT_ROOM_CONFIG } from "@/data/roomThemes";
import type { HomePageState, StreakDay } from "@/types/home";
import { getRoomLayout } from "@/features/room/services/roomApi";
import { getCharacterMe } from "@/features/user/services/userApi";
import { convertLayoutToRoomConfig } from "@/features/room/hooks/useRoom";

import {
  useAds,
  AdConfirmModal,
  AdAlreadyWatchedModal,
  AdPlayer,
  AdExitModal,
  AdRewardModal,
} from "@/features/ads";
import { getRecentStreak } from "@/features/streak/services/streakApi";
import { mapToStreakDays } from "@/utils/streakMapper";

const INITIAL_STATE: HomePageState = {
  points: 0,
  coins: 0,
  streakCount: 0,
  streakDays: [],
  character: null,
  roomConfig: DEFAULT_ROOM_CONFIG,
};

export default function HomePage() {
  const router = useRouter();
  const [homeState, setHomeState] = useState<HomePageState>(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // 1. 방/캐릭터 데이터 최신화 (visibilitychange 대응)
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        try {
          const roomRes = await getRoomLayout();
          if (roomRes.isSuccess && roomRes.result) {
            setHomeState((prev) => ({
              ...prev,
              roomConfig: convertLayoutToRoomConfig(roomRes.result),
            }));
          }
        } catch (e) {
          console.error("방 정보 로드 실패:", e);
        }

        try {
          const char = await getCharacterMe();
          setHomeState((prev) => ({
            ...prev,
            character: char
              ? {
                  id: char.characterId.toString(),
                  characterTypeId: char.characterId.toString(),
                  name: "내 캐릭터",
                  exp: char.currentExp,
                  stage: 1,
                  imageSrc: char.imgUrl,
                }
              : null,
          }));
        } catch (e) {
          console.error("캐릭터 정보 로드 실패:", e);
        }

        try {
          const streakRes = await getRecentStreak();
          setHomeState((prev) => ({
            ...prev,
            streakCount: streakRes.currentStreak,
            streakDays: mapToStreakDays(streakRes.weeklyStreak),
          }));
        } catch (e) {
          console.error("스트릭 정보 로드 실패:", e);
        }
      }
    };

    // 진입 시 초기 로드
    handleVisibility();

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
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
        onGoMission={() => router.push("/mission")}
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
