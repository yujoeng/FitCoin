"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  getUserInfo,
  updateNickname,
  updatePassword,
  updateExerciseLevel,
  deleteUser,
  type UserInfo,
  type ExerciseLevel,
} from "@/features/user/services/userApi";
import { logout } from "@/features/auth/services/authApi";
import {
  getRecentStreak,
  getMonthStreak,
  type RecentStreakResponse,
  type MonthStreakResponse,
} from "@/features/streak/services/streakApi";

import { removeAccessToken } from "@/features/auth/utils/tokenUtils";

// ─────────────────────────────────────────────
// 반환 타입
// ─────────────────────────────────────────────
export interface UseMyPageReturn {
  // 데이터
  userInfo: UserInfo | null;
  recentStreak: RecentStreakResponse | null;
  monthStreak: MonthStreakResponse | null;
  isLoading: boolean;
  error: string | null;
  calendarDate: { year: number; month: number };

  // 모달 / 드롭다운 열림 상태
  nicknameModalOpen: boolean;
  passwordModalOpen: boolean;
  deleteModalOpen: boolean;
  levelDropdownOpen: boolean;

  // 모달 / 드롭다운 제어 함수
  setNicknameModalOpen: (v: boolean) => void;
  setPasswordModalOpen: (v: boolean) => void;
  setDeleteModalOpen: (v: boolean) => void;
  setLevelDropdownOpen: (v: boolean) => void;

  // 액션 함수
  handleLogout: () => Promise<void>;
  handleNicknameUpdate: (nickname: string) => Promise<void>;
  handlePasswordUpdate: (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
  handleLevelUpdate: (level: ExerciseLevel) => Promise<void>;
  handleDeleteUser: (password: string) => Promise<void>;
  handleCalendarPrev: () => void;
  handleCalendarNext: () => void;
}

// ─────────────────────────────────────────────
// 훅 본체
// ─────────────────────────────────────────────
export function useMyPage(): UseMyPageReturn {
  const router = useRouter();

  // ── 데이터 상태 ──
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentStreak, setRecentStreak] = useState<RecentStreakResponse | null>(
    null,
  );
  const [monthStreak, setMonthStreak] = useState<MonthStreakResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── 달력 년/월 ──
  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  // ── 모달/드롭다운 상태 ──
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  // ─────────────────────────────────────────────
  // 초기 데이터 로드
  // ─────────────────────────────────────────────
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // getUserInfo는 필수 — 실패하면 에러 화면
      const info = await getUserInfo();
      setUserInfo(info);

      // 스트릭은 선택 — 실패해도 에러 화면 안 띄움
      // 백엔드 미구현 시 404가 나도 마이페이지는 정상 표시됨
      try {
        const recent = await getRecentStreak();
        setRecentStreak(recent);
      } catch {
        setRecentStreak(null);
      }
    } catch {
      setError("정보를 불러오지 못했어요. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMonthStreak = useCallback(async (year: number, month: number) => {
    try {
      const data = await getMonthStreak(year, month);
      setMonthStreak(data);
    } catch {
      // 달력 조회 실패는 조용히 처리 (주요 기능 아님)
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchMonthStreak(calendarDate.year, calendarDate.month);
  }, [calendarDate, fetchMonthStreak]);

  // ─────────────────────────────────────────────
  // 액션 함수들
  // ─────────────────────────────────────────────

  /** 로그아웃: 서버 토큰 무효화 → 로컬 토큰 삭제 → 로그인 화면으로 이동 */
  const handleLogout = async () => {
    await logout();
    removeAccessToken();
    router.replace("/");
  };

  /** 닉네임 변경: 성공 시 로컬 userInfo 즉시 업데이트 (재조회 없이)
   *  MOCK: 백엔드 없어도 화면에서 닉네임이 바뀌는 것처럼 동작함
   *  API 연동 후: updateNickname 응답값으로 교체 (현재 코드 그대로 유지 가능)
   */
  const handleNicknameUpdate = async (nickname: string) => {
    try {
      const result = await updateNickname({ nickname });
      setUserInfo((prev) =>
        prev ? { ...prev, nickname: result.nickname } : prev,
      );
    } catch {
      throw new Error("닉네임 변경에 실패했습니다.");
    }
  };

  /** 비밀번호 변경
   *  MOCK: 백엔드 없으면 에러가 나지만, 모달에서 에러 메시지로 표시됨 (정상)
   */
  const handlePasswordUpdate = async (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    await updatePassword({ password, newPassword, confirmPassword });
  };

  /** 운동 레벨 변경: 낙관적 업데이트 및 실패 시 롤백 로직 적용 */
  const handleLevelUpdate = async (level: ExerciseLevel) => {
    // 1. 롤백을 위해 변경 전의 현재 상태를 백업해둡니다.
    const previousUserInfo = userInfo;

    // 2. [낙관적 업데이트] 서버 응답을 기다리지 않고 UI 상태를 즉시 변경합니다.
    setUserInfo((prev) => (prev ? { ...prev, exercise_level: level } : prev));
    // 드롭다운도 즉시 닫아 사용자 반응성을 높입니다.
    setLevelDropdownOpen(false);

    try {
      // 3. 실제 API 호출 (/users/me/exercise-level)
      const result = await updateExerciseLevel({ exercise_level: level });

      // 4. 성공 시, 서버에서 받은 최종 데이터로 상태를 동기화합니다.
      setUserInfo((prev) =>
        prev ? { ...prev, exercise_level: result.exercise_level } : prev,
      );
    } catch (err) {
      // 5. [실패 시 복구] 통신 실패(400, 401 등) 시 백업해둔 이전 상태로 되돌립니다.
      console.error(
        "운동 레벨 업데이트에 실패했습니다. 이전 상태로 복구합니다.",
        err,
      );
      setUserInfo(previousUserInfo);

      // 사용자에게 에러 알림 (선택 사항)
      alert("레벨 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /** 회원 탈퇴: 서버 Soft Delete → 로컬 토큰 삭제 → 로그인 화면으로 이동 */
  const handleDeleteUser = async (password: string) => {
    await deleteUser({ password });
    removeAccessToken();
    router.replace("/");
  };

  // ── 달력 이전/다음 달 이동 ──
  const handleCalendarPrev = () => {
    setCalendarDate((prev) =>
      prev.month === 1
        ? { year: prev.year - 1, month: 12 }
        : { year: prev.year, month: prev.month - 1 },
    );
  };

  const handleCalendarNext = () => {
    setCalendarDate((prev) =>
      prev.month === 12
        ? { year: prev.year + 1, month: 1 }
        : { year: prev.year, month: prev.month + 1 },
    );
  };

  return {
    userInfo,
    recentStreak,
    monthStreak,
    isLoading,
    error,
    calendarDate,
    nicknameModalOpen,
    setNicknameModalOpen,
    passwordModalOpen,
    setPasswordModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    levelDropdownOpen,
    setLevelDropdownOpen,
    handleLogout,
    handleNicknameUpdate,
    handlePasswordUpdate,
    handleLevelUpdate,
    handleDeleteUser,
    handleCalendarPrev,
    handleCalendarNext,
  };
}
// 이 파일이 하는 일: 마이페이지의 데이터 로드, 모달 상태, API 호출 로직을 하나의 훅으로 관리한다.
