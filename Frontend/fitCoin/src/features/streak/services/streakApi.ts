// src/features/streak/services/streakApi.ts
// ─────────────────────────────────────────────
// 스트릭(출석) 관련 API 함수 모음
// ─────────────────────────────────────────────

import apiClient from '@/services/apiClient';

// ─────────────────────────────────────────────
// 공통 응답 래퍼 타입
// ─────────────────────────────────────────────
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/** 스트릭 단일 날짜 항목 (최근7일 / 월별 공통) */
export interface StreakItem {
  date: string;     // "2026-03-01" 형식
  checked: boolean; // 해당 날짜 미션 완료 여부
}

/**
 * GET /streak/recent 응답 result 타입
 * - currentStreak: 현재 연속 스트릭 일수
 * - weeklyStreak: 최근 7일 날짜별 출석 여부
 */
export interface RecentStreakResponse {
  currentStreak: number;
  weeklyStreak: StreakItem[];
}

/**
 * GET /streak/month 응답 result 타입
 * - year, month: 조회한 년/월
 * - currentStreak: 현재 연속 스트릭 일수
 * - monthlyStreak: 해당 월의 날짜별 출석 여부
 */
export interface MonthStreakResponse {
  year: number;
  month: number;
  currentStreak: number;
  monthlyStreak: StreakItem[];
}

// ─────────────────────────────────────────────
// API 함수들
// ─────────────────────────────────────────────

/**
 * 최근 7일 스트릭 조회
 * GET /streak/recent
 * Access 토큰 필요 (Axios 인터셉터가 자동으로 헤더에 추가)
 */
export async function getRecentStreak(): Promise<RecentStreakResponse> {
  const response = await apiClient.get<ApiResponse<RecentStreakResponse>>('/streak/recent');
  return response.data.result;
}

/**
 * 월별 스트릭 조회
 * GET /streak/month?year=2026&month=3
 * 유효하지 않은 날짜 → 400 STREAK4001 에러 반환
 */
export async function getMonthStreak(year: number, month: number): Promise<MonthStreakResponse> {
  const response = await apiClient.get<ApiResponse<MonthStreakResponse>>(
    '/streak/month',
    { params: { year, month } }, // Axios params → 자동으로 ?year=&month= 쿼리스트링으로 변환
  );
  return response.data.result;
}
// 이 파일이 하는 일: 스트릭(출석 기록) 관련 API 요청 함수들을 모아둔다.