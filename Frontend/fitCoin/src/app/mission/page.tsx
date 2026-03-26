'use client';

import React, { useEffect, useState } from 'react';
import { MissionProvider, useMission } from '@/features/mission/MissionContext';
import FitCoinMissionPage from '@/views/FitCoinMissionPage';
import FitCoinExercisePage from '@/views/FitCoinExercisePage';
import ExerciseDemoModal from '@/components/ExerciseDemoModal';
import { mergeWithExercise } from '@/features/mission/missionUtils';
import { FITCOIN_EXERCISES } from '@/data/exercises';
import { useMyPage } from '@/features/user/hooks/useMyPage';
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
    completeMission,
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

  const { userInfo } = useMyPage();
  const exerciseLevelIndex =
    userInfo?.exerciseLevel === 'INTERMEDIATE' ? 1
      : userInfo?.exerciseLevel === 'ADVANCED' ? 2
        : 0;

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
    const exercise = mergeWithExercise(mission, FITCOIN_EXERCISES, exerciseLevelIndex);
    if (!exercise) {
      alert('해당 운동을 찾을 수 없습니다');
      return;
    }
    setCurrentMission(exercise);
    setShowDemo(true);
  };

  const handleMissionComplete = async (feedbacks: string[]) => {
    try {
      // 1. 서버 미션 완료 API 호출
      const result = await completeMission();

      // 2. 로컬 dailyState 업데이트
      const newCount = dailyState.missionCount + 1;
      const newDaily: DailyState = { missionCount: newCount };
      saveDailyState(newDaily);
      setDailyState(newDaily);

      // 3. 서버 응답 포인트 사용
      const earned = result.rewardPoint;
      const newTotal = addPoints(earned);
      setEarnedPoint(earned);
      setTotalPoints(newTotal);

      // 4. 첫 번째 미션이면 스트릭 업데이트
      if (result.streakIncreased) setStreak(updateStreak());

      // 5. 운동 기록 저장
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
    } catch (e) {
      console.error('미션 완료 처리 실패:', e);
      alert('미션 완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!isMounted) return null;

  if (availability && !availability.missionAvailable) {
    return (
      <FitCoinMissionPage
        candidates={candidates}
        dailyMissionCount={3}
        onStart={handleStart}
      />
    );
  }

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

  const effectiveMissionCount = availability
    ? availability.todayCompletedMissionCount
    : dailyState.missionCount;

  return (
    <>
      <FitCoinMissionPage
        candidates={candidates}
        dailyMissionCount={effectiveMissionCount}
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
