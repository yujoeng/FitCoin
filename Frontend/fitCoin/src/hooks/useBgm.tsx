"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const BGM_PATH = "/sounds/bgm.mp3";
const STORAGE_KEYS = {
  BGM_ENABLED: "bgm_enabled",
  BGM_VOLUME: "bgm_volume",
  NOTIFICATIONS_ENABLED: "bgm_notifications",
};

// 싱글톤 객체 (클라이언트 사이드 전용)
let audio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let source: MediaElementAudioSourceNode | null = null;

/**
 * AudioContext 및 GainNode 초기화 (싱글톤)
 */
const initAudioContext = () => {
  if (typeof window === "undefined" || !audio || audioCtx) return;

  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNode = audioCtx.createGain();
    // 요청에 따라 고정 2.0배 증폭
    gainNode.gain.value = 2.0;

    source = audioCtx.createMediaElementSource(audio);
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  } catch (err) {
    console.error("AudioContext 초기화 실패:", err);
  }
};

interface BgmContextType {
  isEnabled: boolean;
  volume: number;
  notificationsEnabled: boolean;
  toggleBgm: () => void;
  changeVolume: (val: number) => void;
  toggleNotifications: () => void;
  pauseBgm: () => void;
  resumeBgm: () => void;
}

const BgmContext = createContext<BgmContextType | undefined>(undefined);

/**
 * BGM 설정을 전역으로 관리하는 Provider
 */
export const BgmProvider = ({
  children,
  isPublic
}: {
  children: React.ReactNode;
  isPublic: boolean;
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isAdPaused, setIsAdPaused] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // 컴포넌트 마운트 시 초기화 및 localStorage에서 설정값 로드
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMounted(true);

    const savedEnabled = localStorage.getItem(STORAGE_KEYS.BGM_ENABLED);
    const savedVolume = localStorage.getItem(STORAGE_KEYS.BGM_VOLUME);
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);

    const initialEnabled = savedEnabled !== null ? JSON.parse(savedEnabled) : true;
    const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.3;
    const initialNotifications = savedNotifications !== null ? JSON.parse(savedNotifications) : false;

    // Audio 객체 지연 생성 (서버 사이드 방지)
    if (!audio) {
      audio = new Audio(BGM_PATH);
      audio.loop = true;
      audio.volume = initialVolume;

      // AudioContext 초기화 시도
      initAudioContext();
    }

    setIsEnabled(initialEnabled);
    setVolume(initialVolume);
    setNotificationsEnabled(initialNotifications);
  }, []);

  // 경로 변화(isPublic), 활성화 상태(isEnabled), 광고 여부(isAdPaused)에 따른 재생/일시정지 제어
  useEffect(() => {
    if (!isMounted || !audio) return;

    if (isPublic || isAdPaused) {
      // 로그인/회원가입 등 공용 페이지 또는 광고 재생 중에는 무조건 정지
      audio.pause();
    } else if (isEnabled) {
      // 그 외 페이지에서 설정이 ON이면 재생
      const playAudio = async () => {
        // 브라우저 경고 로그를 막기 위해 사용자 상호작용이 전혀 없었다면 시도조차 하지 않음
        if (typeof navigator !== "undefined" && navigator.userActivation && !navigator.userActivation.hasBeenActive) {
          return;
        }

        try {
          if (audioCtx?.state === "suspended") {
            await audioCtx.resume();
          }
          await audio?.play();
        } catch (err: any) {
          if (err.name === "NotAllowedError") {
            console.warn("BGM 자동재생 차단됨 (사용자 상호작용 대기)");
            setIsEnabled(false);
          } else {
            console.error("BGM 재생 오류:", err);
          }
        }
      };
      playAudio();
    } else {
      // 설정이 OFF면 정지
      audio.pause();
    }
  }, [isPublic, isEnabled, isAdPaused, isMounted]);

  // 자동재생 차단 대응: 사용자가 페이지를 처음 클릭할 때 무조건 AudioContext를 열어둠
  useEffect(() => {
    if (!isMounted || !audio) return;

    const handleFirstInteraction = async () => {
      // 퍼블릭/프라이빗 상관없이 최초 클릭 시 AudioContext를 Active 상태로 만듦
      if (audioCtx?.state === "suspended") {
        await audioCtx.resume();
      }
      
      // 현재 BGM이 재생조건(프라이빗 + 켜져있음)에 맞으면 즉시 재생 시도
      if (isEnabled && audio && audio.paused && !isPublic && !isAdPaused) {
        try {
          await audio.play();
        } catch (err) {
          // 일시적 에러 무시
        }
      }

      // 이벤트 리스너는 1회 동작 후 바로 제거 (브라우저 정책 상 1회면 충분)
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    // 항상 클릭 리스너를 달아둠 (로그인 페이지 등에서 최초 클릭 시 context가 열리게 됨)
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [isEnabled, isPublic, isAdPaused, isMounted]);

  const toggleBgm = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.BGM_ENABLED, JSON.stringify(next));
      return next;
    });
  }, []);

  const changeVolume = useCallback((val: number) => {
    const normalized = Math.max(0, Math.min(1, val));
    setVolume(normalized);
    localStorage.setItem(STORAGE_KEYS.BGM_VOLUME, normalized.toString());
    if (audio) {
      audio.volume = normalized;
    }
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(next));
      return next;
    });
  }, []);

  const pauseBgm = useCallback(() => {
    setIsAdPaused(true);
    if (audio) {
      audio.pause();
    }
  }, []);

  const resumeBgm = useCallback(() => {
    setIsAdPaused(false);
    if (isEnabled && audio && !isPublic) {
      audio.play().catch(() => {
        /* 자동재생 차단 등 무시 */
      });
    }
  }, [isEnabled, isPublic]);

  const contextValue = useMemo(() => ({
    isEnabled,
    volume,
    notificationsEnabled,
    toggleBgm,
    changeVolume,
    toggleNotifications,
    pauseBgm,
    resumeBgm,
  }), [isEnabled, volume, notificationsEnabled, toggleBgm, changeVolume, toggleNotifications, pauseBgm, resumeBgm]);

  return <BgmContext.Provider value={contextValue}>{children}</BgmContext.Provider>;
};

/**
 * 전역 BGM 컨텍스트를 사용하는 커스텀 훅
 */
export const useBgm = () => {
  const context = useContext(BgmContext);
  if (context === undefined) {
    throw new Error("useBgm must be used within a BgmProvider");
  }
  return context;
};
