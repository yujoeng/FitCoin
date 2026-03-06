import React, { useState, useEffect } from 'react';
import { AppTopBar, AppTabBar } from './components/AppShell';
import FitCoinMissionPage  from './pages/FitCoinMissionPage';
import FitCoinExercisePage from './pages/FitCoinExercisePage';
import FitCoinResultPage   from './pages/FitCoinResultPage';
import FitCoinCoachPage    from './pages/FitCoinCoachPage';
import { FITCOIN_EXERCISES, FITCOIN_POINT_POLICY } from './data/exercises';
import {
  loadDailyState, saveDailyState,
  loadStreak, updateStreak,
  loadTotalPoints, addPoints,
  addHistoryEntry,
} from './utils/fitcoinStorage';

export default function FitCoinApp() {
  const [page, setPage] = useState('mission');
  const [currentMission, setCurrentMission] = useState(null);
  const [dailyState,  setDailyState]  = useState(loadDailyState);
  const [streak,      setStreak]      = useState(loadStreak);
  const [totalPoints, setTotalPoints] = useState(loadTotalPoints);
  const [earnedPoint, setEarnedPoint] = useState(0);
  // 운동 중 수집한 피드백 (AI Coach용)
  const [sessionFeedbacks, setSessionFeedbacks] = useState([]);

  // 날짜 경계마다 daily state 동기화
  useEffect(() => {
    const id = setInterval(() => setDailyState(loadDailyState()), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleStart = (mission) => {
    setSessionFeedbacks([]);
    setCurrentMission(mission);
    setPage('exercise');
  };

  const handleComplete = (feedbacks = []) => {
    const prev     = dailyState.missionCount;
    const newCount = prev + 1;
    const newDaily = { missionCount: newCount };
    saveDailyState(newDaily);
    setDailyState(newDaily);

    const earned   = prev === 0 ? FITCOIN_POINT_POLICY.first : FITCOIN_POINT_POLICY.bonus;
    const newTotal = addPoints(earned);
    setEarnedPoint(earned);
    setTotalPoints(newTotal);

    if (prev === 0) setStreak(updateStreak());

    // 운동 이력 저장 (AI Coach용)
    addHistoryEntry({
      exerciseId:   currentMission.id,
      exerciseName: currentMission.name,
      count:        currentMission.targetCount,
      category:     currentMission.category,
      feedbackKeys: feedbacks,
    });

    setPage('result');
  };

  const tabLabel = { mission: 'mission', exercise: 'exercise', result: 'result', coach: 'coach' }[page] ?? 'mission';

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
        {page === 'mission'  && (
          <FitCoinMissionPage
            exercises={FITCOIN_EXERCISES}
            dailyMissionCount={dailyState.missionCount}
            onStart={handleStart}
          />
        )}
        {page === 'exercise' && (
          <FitCoinExercisePage
            mission={currentMission}
            onComplete={handleComplete}
            onCollectFeedback={setSessionFeedbacks}
            onBack={() => setPage('mission')}
          />
        )}
        {page === 'result'   && (
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
        {page === 'coach'    && <FitCoinCoachPage />}
      </div>

      <AppTabBar active={tabLabel} onNavigate={setPage} />
    </div>
  );
}
