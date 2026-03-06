// ── 공통 타입 정의 ──

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  targetCount: number;
  camera: 'full' | 'upper';
  detectFn: (landmarks: unknown) => string;
}

export interface HistoryEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  count: number;
  category: string;
  feedbackKeys: string[];
  date: string;
}

export interface DailyState {
  missionCount: number;
}

export interface StreakState {
  count: number;
  lastDate: string;
}

export interface AIRecommendation {
  comment: string;
  recommendations: {
    name: string;
    reason: string;
    target: string;
  }[];
}
