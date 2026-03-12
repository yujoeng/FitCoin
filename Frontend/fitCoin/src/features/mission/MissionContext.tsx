'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getMissionAvailability,
  getMissionCandidates,
  startMission as apiStartMission,
  completeMission as apiCompleteMission,
} from '@/services/missionApi';
import type {
  MissionAvailability,
  MissionCandidate,
  MissionStartRequest,
  MissionCompleteRequest,
  MissionCompleteResult,
} from '@/types';

// ── 컨텍스트 값 타입 ──
interface MissionContextValue {
  availability: MissionAvailability | null;
  candidates: MissionCandidate[];
  missionToken: string | null;
  isLoading: boolean;
  error: string | null;

  fetchAvailability: () => Promise<void>;
  fetchCandidates: () => Promise<void>;
  startMission: (missionId: number) => Promise<void>;
  completeMission: () => Promise<MissionCompleteResult>;
}

// ── Context 생성 ──
const MissionContext = createContext<MissionContextValue | null>(null);

// ── Provider ──
export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [availability, setAvailability] = useState<MissionAvailability | null>(null);
  const [candidates, setCandidates] = useState<MissionCandidate[]>([]);
  const [missionToken, setMissionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── 1. 미션 가용성 조회 ──
  const fetchAvailability = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMissionAvailability();
      setAvailability(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 가용성 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── 2. 미션 후보 조회 ──
  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMissionCandidates();
      setCandidates(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 후보 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── 3. 미션 시작 ──
  const startMission = useCallback(async (missionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const body: MissionStartRequest = {
        missionId,
        missionStartedAt: new Date().toISOString().slice(0, 19), // "2026-03-12T22:00:00"
      };
      const result = await apiStartMission(body);
      setMissionToken(result.missionToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 시작 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── 4. 미션 완료 ──
  const completeMission = useCallback(async (): Promise<MissionCompleteResult> => {
    if (!missionToken) {
      throw new Error('missionToken이 없습니다. 미션을 먼저 시작해주세요.');
    }
    setIsLoading(true);
    setError(null);
    try {
      const body: MissionCompleteRequest = {
        missionToken,
        missionCompletedAt: new Date().toISOString().slice(0, 19),
      };
      const result = await apiCompleteMission(body);
      setMissionToken(null); // 완료 후 토큰 초기화
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 완료 처리 중 오류가 발생했습니다.');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [missionToken]);

  return (
    <MissionContext.Provider
      value={{
        availability,
        candidates,
        missionToken,
        isLoading,
        error,
        fetchAvailability,
        fetchCandidates,
        startMission,
        completeMission,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

// ── useMission 훅 ──
export function useMission(): MissionContextValue {
  const ctx = useContext(MissionContext);
  if (!ctx) {
    throw new Error('useMission은 MissionProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}

export default MissionContext;
