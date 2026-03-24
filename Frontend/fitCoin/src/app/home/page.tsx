"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import HomeView from "@/views/HomeView";
import { DEFAULT_ROOM_CONFIG } from "@/data/roomThemes";
import type { HomePageState, StreakDay } from "@/types/home";
import { getRoomLayout } from "@/features/room/services/roomApi";
import { getCharacterMe } from "@/features/user/services/userApi";
import { convertLayoutToRoomConfig } from "@/features/room/hooks/useRoom";
import CharacterGraduateModal from "@/features/character/components/CharacterGraduateModal";
import { graduateCharacter } from "@/features/character/services/characterApi";
import { getWallet } from "@/features/wallet/services/walletApi";

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
  character: null,
  roomConfig: DEFAULT_ROOM_CONFIG,
};

export default function HomePage() {
  const router = useRouter();
  const [homeState, setHomeState] = useState<HomePageState>(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);
  const [isGraduateModalOpen, setIsGraduateModalOpen] = useState(false);
  const [gifticonImageUrl, setGifticonImageUrl] = useState<string | null>(null);

  // 1. 방/캐릭터 데이터 최신화 (visibilitychange 대응)
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const roomRes = await getRoomLayout();
          if (roomRes.isSuccess && roomRes.result) {
            setHomeState(prev => ({
              ...prev,
              roomConfig: convertLayoutToRoomConfig(roomRes.result)
            }));
          }
        } catch (e) {
          console.error("방 정보 로드 실패:", e);
        }

        try {
          const char = await getCharacterMe();
          if (char === null) {
            router.push('/character/adopt');
            return;
          }
          setHomeState(prev => ({
            ...prev,
            character: {
              id: char.characterId.toString(),
              characterTypeId: char.characterId.toString(),
              name: "내 캐릭터",
              exp: char.currentExp,
              stage: 1,
              isGraduatable: char.isGraduatable,
              imageSrc: char.imgUrl,
            }
          }));
        } catch (e) {
          console.error("캐릭터 정보 로드 실패:", e);
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

  const handleGraduate = async () => {
    try {
      await graduateCharacter();
      try {
        const walletRes = await getWallet();
        if (walletRes.isSuccess && walletRes.result?.gifticons?.length > 0) {
          const sorted = [...walletRes.result.gifticons].sort((a, b) => 
            new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
          );
          setGifticonImageUrl(sorted[0].imageUrl);
        } else {
          setGifticonImageUrl(null);
        }
      } catch (walletErr) {
        console.error("기프티콘 조회 실패:", walletErr);
        setGifticonImageUrl(null);
      }
      setIsGraduateModalOpen(true);
    } catch (err: any) {
      console.error("졸업 실패:", err);
      if (err.response?.status === 404) {
        setGifticonImageUrl(null);
        setIsGraduateModalOpen(true);
      }
    }
  };

  const handleGraduateConfirm = () => {
    setIsGraduateModalOpen(false);
    router.push('/character');
  };

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
        onGraduate={handleGraduate}
      />

      <CharacterGraduateModal
        isOpen={isGraduateModalOpen}
        gifticonImageUrl={gifticonImageUrl}
        onConfirm={handleGraduateConfirm}
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