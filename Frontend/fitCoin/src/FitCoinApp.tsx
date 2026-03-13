'use client';

import React, { useState, useEffect } from 'react';
import { AppTopBar, AppTabBar } from '@/components/AppShell';
import FitCoinMissionPage  from '@/views/FitCoinMissionPage';
import FitCoinExercisePage from '@/views/FitCoinExercisePage';
import FitCoinResultPage   from '@/views/FitCoinResultPage';
import FitCoinCoachPage    from '@/views/FitCoinCoachPage';
import { FITCOIN_EXERCISES, FITCOIN_POINT_POLICY } from '@/data/exercises';
import {
  loadDailyState, saveDailyState,
  loadStreak, updateStreak,
  loadTotalPoints, addPoints,
  addHistoryEntry,
} from '@/utils/fitcoinStorage';
import { mergeWithExercise } from '@/features/mission/missionUtils';
import type { MissionCandidate, Exercise, DailyState, StreakState } from '@/types';

type PageType = 'mission' | 'exercise' | 'result' | 'coach';

export default function FitCoinApp() {
  const [page, setPage]               = useState<PageType>('mission');
  const [currentMission, setCurrentMission] = useState<Exercise | null>(null);
  const [dailyState,  setDailyState]  = useState<DailyState>({ missionCount: 0 });
  const [streak,      setStreak]      = useState<StreakState>({ count: 0, lastDate: '' });
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [earnedPoint, setEarnedPoint] = useState<number>(0);
  const [isMounted, setIsMounted]     = useState(false);

  // 날짜 경계마다 daily state 동기화 및 최초 하이드레이션
  useEffect(() => {
    setIsMounted(true);
    setDailyState(loadDailyState());
    setStreak(loadStreak());
    setTotalPoints(loadTotalPoints());

    const id = setInterval(() => setDailyState(loadDailyState()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!isMounted) return null;

  const handleStart = (mission: MissionCandidate) => {
    // TODO: userLevel은 현재 0(초급) 고정. 추후 사용자 설정 반영 시 수정 필요
    const exercise = mergeWithExercise(mission, FITCOIN_EXERCISES, 0);
    if (!exercise) {
      alert('해당 미션을 찾을 수 없습니다.');
      return;
    }
    setCurrentMission(exercise);
    setPage('exercise');
  };

  const handleComplete = (feedbacks: string[] = []) => {
    const prev     = dailyState.missionCount;
    const newCount = prev + 1;
    const newDaily: DailyState = { missionCount: newCount };
    saveDailyState(newDaily);
    setDailyState(newDaily);

    const earned   = prev === 0 ? FITCOIN_POINT_POLICY.first : FITCOIN_POINT_POLICY.bonus;
    const newTotal = addPoints(earned);
    setEarnedPoint(earned);
    setTotalPoints(newTotal);

    if (prev === 0) setStreak(updateStreak());

    // 운동 이력 저장 (AI Coach용)
    if (currentMission) {
      addHistoryEntry({
        exerciseId:   currentMission.id,
        exerciseName: currentMission.name,
        count:        currentMission.targetCount,
        category:     currentMission.category,
        feedbackKeys: feedbacks,
      });
    }

    setPage('result');
  };

  const tabLabel = ({ mission: 'mission', exercise: 'exercise', result: 'result', coach: 'coach' } as const)[page] ?? 'mission';

  return (
    <div className="fc-app-shell">
      <AppTopBar
        page={page}
        mission={currentMission}
        streak={streak}
        totalPoints={totalPoints}
        onBack={() => setPage('mission')}
      />

      <div className="fc-body">
        {page === 'mission' && (
          <FitCoinMissionPage
            candidates={[] /* TODO: MissionContext 연동 후 교체 */}
            dailyMissionCount={dailyState.missionCount}
            onStart={handleStart}
          />
        )}
        {page === 'exercise' && currentMission && (
          <FitCoinExercisePage
            mission={currentMission}
            onComplete={handleComplete}
            onBack={() => setPage('mission')}
          />
        )}
        {page === 'result' && (
          <FitCoinResultPage
            mission={currentMission}
            missionCount={dailyState.missionCount}
            earnedPoint={earnedPoint}
            totalPoints={totalPoints}
            streak={streak}
            onNext={() => setPage('mission')}
            onHome={() => setPage('mission')}
          />
        )}
        {page === 'coach' && <FitCoinCoachPage />}
      </div>

      <AppTabBar active={tabLabel} onNavigate={(p) => setPage(p as PageType)} />
    </div>
  );
}
