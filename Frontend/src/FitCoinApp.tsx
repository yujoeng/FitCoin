'use client';

import React, { useState, useEffect } from 'react';
import { AppTopBar, AppTabBar } from '@/components/AppShell';
import FitCoinMissionPage  from '@/pages/FitCoinMissionPage';
import FitCoinExercisePage from '@/pages/FitCoinExercisePage';
import FitCoinResultPage   from '@/pages/FitCoinResultPage';
import FitCoinCoachPage    from '@/pages/FitCoinCoachPage';
import { FITCOIN_EXERCISES, FITCOIN_POINT_POLICY } from '@/data/exercises';
import {
  loadDailyState, saveDailyState,
  loadStreak, updateStreak,
  loadTotalPoints, addPoints,
  addHistoryEntry,
} from '@/utils/fitcoinStorage';
import type { Exercise, DailyState, StreakState } from '@/types';

type PageType = 'mission' | 'exercise' | 'result' | 'coach';

export default function FitCoinApp() {
  const [page, setPage]               = useState<PageType>('mission');
  const [currentMission, setCurrentMission] = useState<Exercise | null>(null);
  const [dailyState,  setDailyState]  = useState<DailyState>(() => loadDailyState());
  const [streak,      setStreak]      = useState<StreakState>(() => loadStreak());
  const [totalPoints, setTotalPoints] = useState<number>(() => loadTotalPoints());
  const [earnedPoint, setEarnedPoint] = useState<number>(0);

  // 날짜 경계마다 daily state 동기화
  useEffect(() => {
    const id = setInterval(() => setDailyState(loadDailyState()), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleStart = (mission: Exercise) => {
    setCurrentMission(mission);
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
            exercises={FITCOIN_EXERCISES}
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
