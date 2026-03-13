'use client';

import React, { useEffect, useState } from 'react';
import { MissionProvider, useMission } from '@/features/mission/MissionContext';
import FitCoinMissionPage from '@/views/FitCoinMissionPage';
import FitCoinExercisePage from '@/views/FitCoinExercisePage';
import ExerciseDemoModal from '@/components/ExerciseDemoModal';
import { mergeWithExercise } from '@/features/mission/missionUtils';
import { FITCOIN_EXERCISES } from '@/data/exercises';
import type { MissionCandidate, Exercise } from '@/types';

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

  // 이 파일 안에서만 관리하는 화면 전환 상태
  const [currentPage, setCurrentPage] = useState<'mission' | 'exercise'>('mission');
  const [currentMission, setCurrentMission] = useState<Exercise | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    fetchAvailability();
    fetchCandidates();
  }, [fetchAvailability, fetchCandidates]);

  const handleStart = async (mission: MissionCandidate) => {
    await startMission(mission.id);
    // TODO: userLevel은 현재 0(초급) 고정. 추후 사용자 설정 반영 시 수정 필요
    const exercise = mergeWithExercise(mission, FITCOIN_EXERCISES, 0);
    if (!exercise) {
      alert('해당 운동을 찾을 수 없습니다');
      return;
    }
    setCurrentMission(exercise);
    setShowDemo(true);
  };

  const handleMissionComplete = (feedbacks: string[]) => {
    console.log('미션 완료 피드백:', feedbacks);
    // TODO: 백엔드 /missions/complete API 연결 후 실제 포인트 적립 처리로 교체
    setCurrentPage('mission');
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

  if (currentPage === 'exercise' && currentMission) {
    return (
      <FitCoinExercisePage
        mission={currentMission}
        onComplete={handleMissionComplete}
        onBack={() => setCurrentPage('mission')}
        // TODO: 실제 포인트/코인 값 연결 후 교체
        point={0}
        coin={0}
      />
    );
  }

  return (
    <>
      <FitCoinMissionPage
        candidates={candidates}
        dailyMissionCount={availability?.todayCompletedMissionCount ?? 0}
        onStart={handleStart}
      />
      {showDemo && currentMission && (
        <ExerciseDemoModal
          exercise={currentMission}
          onStart={() => {
            setShowDemo(false);
            setCurrentPage('exercise');
          }}
          onClose={() => setShowDemo(false)}
        />
      )}
    </>
  );
}

export default function MissionPage() {
  return (
    <MissionProvider>
      <MissionPageContent />
    </MissionProvider>
  );
}
