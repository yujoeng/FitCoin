'use client';

import { useState, useCallback } from 'react';
import { getAdAvailability, startAd, completeAd } from '../services/adsApi';

export type AdStep = 
  | 'idle' 
  | 'confirm' 
  | 'already-watched' 
  | 'playing' 
  | 'exit-confirm' 
  | 'reward';

export const useAds = () => {
  const [step, setStep] = useState<AdStep>('idle');
  const [adUrl, setAdUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── 테스트용 mock 설정 ──
  const MOCK_VIDEO_URL = '/SSAFY.mp4';
  const WATCHED_KEY = 'fitcoin_ad_watched_today';

  // 광고 버튼 클릭 시: 가능 여부 확인
  const handleAdButtonClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // 1. 테스트용 로컬 상태 확인 (클라이언트 사이드에서만 안전)
    if (typeof window !== 'undefined') {
      const isWatchedToday = localStorage.getItem(WATCHED_KEY) === 'true';
      if (isWatchedToday) {
        setStep('already-watched');
        setIsLoading(false);
        return;
      }
    }

    try {
      // 2. API 호출
      const { adWatchAvailable } = await getAdAvailability();
      if (adWatchAvailable) {
        setStep('confirm');
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem(WATCHED_KEY, 'true');
        }
        setStep('already-watched');
      }
    } catch (err) {
      console.error('Failed to check ad availability (falling back to mock):', err);
      // API 실패 시 "시청 불가" 모달을 보여줌 (user 요청)
      setStep('already-watched');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 광고 시작 확정 시
  const handleConfirmYes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { adUrl: serverAdUrl } = await startAd();
      setAdUrl(serverAdUrl);
      setStep('playing');
    } catch (err: any) {
      console.error('Failed to start ad (falling back to mock video):', err);
      // API 실패 시에도 UI 테스트를 위해 mock 영상 재생
      setAdUrl(MOCK_VIDEO_URL);
      setStep('playing');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfirmNo = useCallback(() => {
    setStep('idle');
  }, []);

  const handleAlreadyWatchedClose = useCallback(() => {
    setStep('idle');
  }, []);

  // 재생 중 'X' 클릭 (나가기 요청)
  const handleExitRequest = useCallback(() => {
    setStep('exit-confirm');
  }, []);

  // 나가기 확정 (보상 포기)
  const handleExitConfirm = useCallback(() => {
    setAdUrl('');
    setStep('idle');
  }, []);

  // 계속 보기
  const handleExitCancel = useCallback(() => {
    setStep('playing');
  }, []);

  // 영상 자연 종료 시
  const handleVideoEnded = useCallback(async () => {
    setIsLoading(true);
    try {
      await completeAd();
      if (typeof window !== 'undefined') {
        localStorage.setItem(WATCHED_KEY, 'true');
      }
      setStep('reward');
    } catch (err) {
      console.error('Failed to complete ad (mocking success):', err);
      if (typeof window !== 'undefined') {
        localStorage.setItem(WATCHED_KEY, 'true');
      }
      setStep('reward');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRewardClose = useCallback(() => {
    setAdUrl('');
    setStep('idle');
  }, []);

  // 테스트를 위한 초기화 함수
  const resetAdStatus = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WATCHED_KEY);
      alert('광고 시청 상태가 초기화되었습니다.');
    }
  }, []);

  return {
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
    resetAdStatus,
  };
};
