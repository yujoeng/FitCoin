'use client';

import React, { useEffect, useState } from 'react';
import { MissionProvider, useMission } from '@/features/mission/MissionContext';
import FitCoinMissionPage from '@/views/FitCoinMissionPage';
import FitCoinExercisePage from '@/views/FitCoinExercisePage';
import ExerciseDemoModal from '@/components/ExerciseDemoModal';
import { mergeWithExercise } from '@/features/mission/missionUtils';
import { FITCOIN_EXERCISES, FITCOIN_POINT_POLICY } from '@/data/exercises';
import {
  loadDailyState, saveDailyState,
  loadStreak, updateStreak,
  loadTotalPoints, addPoints,
  addHistoryEntry,
} from '@/utils/fitcoinStorage';
import MissionResultModal from '@/components/MissionResultModal';
import type { MissionCandidate, Exercise, DailyState, StreakState } from '@/types';

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
  const [dailyState, setDailyState] = useState<DailyState>({ missionCount: 0 });
  const [streak, setStreak] = useState<StreakState>({ count: 0, lastDate: '' });
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [earnedPoint, setEarnedPoint] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    fetchAvailability();
    fetchCandidates();
  }, [fetchAvailability, fetchCandidates]);

  useEffect(() => {
    setIsMounted(true);
    setDailyState(loadDailyState());
    setStreak(loadStreak());
    setTotalPoints(loadTotalPoints());
    const id = setInterval(() => setDailyState(loadDailyState()), 60_000);
    return () => clearInterval(id);
  }, []);

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
    const prev = dailyState.missionCount;
    const newCount = prev + 1;
    const newDaily: DailyState = { missionCount: newCount };
    saveDailyState(newDaily);
    setDailyState(newDaily);

    const earned = prev === 0 ? FITCOIN_POINT_POLICY.first : FITCOIN_POINT_POLICY.bonus;
    const newTotal = addPoints(earned);
    setEarnedPoint(earned);
    setTotalPoints(newTotal);

    if (prev === 0) setStreak(updateStreak());

    if (currentMission) {
      addHistoryEntry({
        exerciseId: currentMission.id,
        exerciseName: currentMission.name,
        count: currentMission.targetCount,
        category: currentMission.category,
        feedbackKeys: feedbacks,
      });
    }

    setCurrentPage('mission');
    setModalVisible(true);
  };

  if (!isMounted) return null;

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
        dailyMissionCount={dailyState.missionCount}
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
      {modalVisible && (
        <MissionResultModal
          rewardPoint={earnedPoint}
          totalPoint={totalPoints}
          onConfirm={() => setModalVisible(false)}
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
