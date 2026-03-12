// src/types/index.ts

// ── 공통 타입 정의 ──

import { Dispatch, SetStateAction } from 'react';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  targetCount: number;
  camera: 'full' | 'upper';
  initialState: string;
  hasFeedback?: boolean;
  detectFn: (
    landmarks: unknown,
    state: string,
    setCount: Dispatch<SetStateAction<number>>,
    setState: Dispatch<SetStateAction<string>>
  ) => void;
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

// ── 미션 관련 타입 ──

// GET /missions/availability 응답
export interface MissionAvailability {
  missionAvailable: boolean;
  dailyMissionLimit: number;         // 항상 3
  todayCompletedMissionCount: number; // 0~3
}

// GET /missions/candidates 응답 — 미션 후보 1개
export interface MissionCandidate {
  id: number;
  name: string;
  description: string;
  count: number[]; // [초급, 중급, 고급] 예) [5, 10, 20]
}

// POST /missions/start 요청 Body
export interface MissionStartRequest {
  missionId: number;
  missionStartedAt: string; // "2026-03-07T15:10:12" 형태
}

// POST /missions/start 응답 result
export interface MissionStartResult {
  missionId: number;
  missionToken: string; // 미션 완료 시 사용할 JWT
}

// POST /missions/complete 요청 Body
export interface MissionCompleteRequest {
  missionToken: string;
  missionCompletedAt: string; // "2026-03-07T16:02:10" 형태
}

// POST /missions/complete 응답 result
export interface MissionCompleteResult {
  missionId: number;
  rewardPoint: number;        // 1000 or 500
  streakIncreased: boolean;   // 첫 번째 미션일 때만 true
  characterExpGained: boolean; // 첫 번째 미션일 때만 true
}

// 공통 API 응답 래퍼
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
}