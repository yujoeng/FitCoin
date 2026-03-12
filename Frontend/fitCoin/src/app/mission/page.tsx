'use client';

import React, { useEffect } from 'react';
import { MissionProvider, useMission } from '@/features/mission/MissionContext';
import FitCoinMissionPage from '@/views/FitCoinMissionPage';
import type { MissionCandidate } from '@/types';

// MissionProvider 안에서 훅을 사용하기 위해 내부 컴포넌트로 분리
function MissionPageContent() {
  const {
    candidates,
    availability,
    fetchAvailability,
    fetchCandidates,
    startMission,
    isLoading,
    error,
  } = useMission();

  useEffect(() => {
    fetchAvailability();
    fetchCandidates();
  }, [fetchAvailability, fetchCandidates]);

  const handleStart = async (mission: MissionCandidate) => {
    await startMission(mission.id);
    // TODO: 미션 시작 후 exercise 페이지로 라우팅 처리
  };

  if (isLoading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ padding: 24, color: 'red' }}>{error}</div>;
  }

  if (candidates.length === 0) {
    return <div style={{ padding: 24, textAlign: 'center' }}>미션 데이터가 없습니다.</div>;
  }

  return (
    <FitCoinMissionPage
      candidates={candidates}
      dailyMissionCount={availability?.todayCompletedMissionCount ?? 0}
      onStart={handleStart}
    />
  );
}

export default function MissionPage() {
  return (
    <MissionProvider>
      <MissionPageContent />
    </MissionProvider>
  );
}
