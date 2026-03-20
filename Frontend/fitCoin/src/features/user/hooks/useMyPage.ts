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
  userInfo: UserInfo | null;
  recentStreak: RecentStreakResponse | null;
  monthStreak: MonthStreakResponse | null;
  isLoading: boolean;
  error: string | null;
  calendarDate: { year: number; month: number };

  nicknameModalOpen: boolean;
  passwordModalOpen: boolean;
  deleteModalOpen: boolean;
  levelDropdownOpen: boolean;

  setNicknameModalOpen: (v: boolean) => void;
  setPasswordModalOpen: (v: boolean) => void;
  setDeleteModalOpen: (v: boolean) => void;
  setLevelDropdownOpen: (v: boolean) => void;

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

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentStreak, setRecentStreak] = useState<RecentStreakResponse | null>(
    null,
  );
  const [monthStreak, setMonthStreak] = useState<MonthStreakResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

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
      // 달력 조회 실패는 조용히 처리
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

  /** 닉네임 변경: 성공 시 로컬 userInfo 즉시 업데이트 */
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

  /** 비밀번호 변경 */
  const handlePasswordUpdate = async (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    await updatePassword({ password, newPassword, confirmPassword });
  };

  /** 운동 레벨 변경: 낙관적 업데이트 + 실패 시 롤백 */
  const handleLevelUpdate = async (level: ExerciseLevel) => {
    const previousUserInfo = userInfo;

    setUserInfo((prev) => (prev ? { ...prev, exerciseLevel: level } : prev));
    setLevelDropdownOpen(false);

    try {
      const result = await updateExerciseLevel({ exerciseLevel: level });
      setUserInfo((prev) =>
        prev ? { ...prev, exerciseLevel: result.exerciseLevel } : prev,
      );
    } catch (err) {
      console.error(
        "운동 레벨 업데이트에 실패했습니다. 이전 상태로 복구합니다.",
        err,
      );
      setUserInfo(previousUserInfo);
      alert("레벨 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /** 회원 탈퇴: 서버 Soft Delete → 로컬 토큰 삭제 → 로그인 화면으로 이동 */
  const handleDeleteUser = async (password: string) => {
    await deleteUser({ password });
    removeAccessToken();
    router.replace("/");
  };

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
