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

// ── Mock 데이터 (NEXT_PUBLIC_USE_MOCK=true 일 때 사용) ──
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const MOCK_AVAILABILITY = {
  missionAvailable: true,
  dailyMissionLimit: 3,
  todayCompletedMissionCount: 0,
};

const MOCK_CANDIDATES = [
  { id: 22, name: '스쿼트', description: '발을 어깨너비로 벌리고 무릎을 90°까지 굽혔다 일어나세요', count: [10, 20, 40] },
  { id: 19, name: '아령 컬', description: '팔꿈치를 몸에 붙이고 아령을 들어올렸다 내리세요', count: [10, 20, 40] },
  { id: 32, name: '숄더레이즈', description: '팔을 옆으로 어깨 높이까지 들어올렸다 내리세요', count: [10, 20, 40] },
];


const MOCK_START_RESULT = {
  missionId: 0, // startMission 호출 시 실제 missionId로 덮어씀
};

const MOCK_COMPLETE_RESULT = {
  missionId: 1,
  rewardPoint: 1000,
  streakIncreased: true,
  characterExpGained: true,
};

// ── 컨텍스트 값 타입 ──
interface MissionContextValue {
  availability: MissionAvailability | null;
  candidates: MissionCandidate[];
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
  const [currentMissionId, setCurrentMissionId] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isLoading = loadingCount > 0;

  // ── 1. 미션 가용성 조회 ──
  const fetchAvailability = useCallback(async () => {
    setLoadingCount((prev) => prev + 1);
    setError(null);
    try {
      if (USE_MOCK) {
        setAvailability(MOCK_AVAILABILITY);
      } else {
        const result = await getMissionAvailability();
        setAvailability(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 가용성 조회 중 오류가 발생했습니다.');
    } finally {
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  // ── 2. 미션 후보 조회 ──
  const fetchCandidates = useCallback(async () => {
    setLoadingCount((prev) => prev + 1);
    setError(null);
    try {
      // TODO: AI 모듈 매핑은 FitCoinMissionPage에서 처리
      if (USE_MOCK) {
        setCandidates(MOCK_CANDIDATES);
      } else {
        const result = await getMissionCandidates();
        setCandidates(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 후보 조회 중 오류가 발생했습니다.');
    } finally {
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  // ── 3. 미션 시작 ──
  const startMission = useCallback(async (missionId: number) => {
    setLoadingCount((prev) => prev + 1);
    setError(null);
    try {
      if (USE_MOCK) {
        // mock branch
        setCurrentMissionId(missionId);
      } else {
        const body: MissionStartRequest = {
          missionId,
          missionStartedAt: new Date().toISOString(), // "2026-03-12T22:00:00"
        };
        await apiStartMission(body);
        setCurrentMissionId(missionId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 시작 중 오류가 발생했습니다.');
    } finally {
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  // ── 4. 미션 완료 ──
  const completeMission = useCallback(async (): Promise<MissionCompleteResult> => {
    if (!currentMissionId) throw new Error('missionId가 없습니다. 미션을 먼저 시작해주세요.');

    setLoadingCount((prev) => prev + 1);
    setError(null);
    try {
      if (USE_MOCK) {
        setCurrentMissionId(null);
        return MOCK_COMPLETE_RESULT;
      }
      const body: MissionCompleteRequest = {
        missionId: currentMissionId,
        missionCompletedAt: new Date().toISOString(),
      };
      const result = await apiCompleteMission(body);
      setCurrentMissionId(null);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : '미션 완료 처리 중 오류가 발생했습니다.');
      throw e;
    } finally {
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, [currentMissionId]);

  return (
    <MissionContext.Provider
      value={{
        availability,
        candidates,
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
