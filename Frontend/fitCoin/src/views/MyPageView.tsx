"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import SettingModal from "@/components/SettingModal";
import { useMyPage } from "@/features/user/hooks/useMyPage";
import {
  EXERCISE_LEVEL_LABELS,
  type ExerciseLevel,
} from "@/features/user/services/userApi";
import type { StreakItem } from "@/features/streak/services/streakApi";

// ─────────────────────────────────────────────
// 유틸리티
// ─────────────────────────────────────────────
function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0(일)~6(토)
  const daysInMonth = new Date(year, month, 0).getDate();
  return { firstDay, daysInMonth };
}

function extractDay(dateStr: string): number {
  return parseInt(dateStr.split("-")[2], 10);
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 모달 기본 껍데기
// ─────────────────────────────────────────────
interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "320px",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-5)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          background: "var(--color-bg-card)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 입력 필드 (공통)
// ─────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  errorMessage?: string;
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  errorMessage,
}: InputFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        marginBottom: "var(--space-3)",
      }}
    >
      <label
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-body)",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-3) var(--space-4)",
          fontSize: "var(--text-sm)",
          outline: "none",
          border: `1px solid ${errorMessage ? "#e05252" : "transparent"}`,
          background: "var(--color-primary-light)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
          boxSizing: "border-box",
        }}
      />
      {errorMessage && (
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "#e05252",
            fontFamily: "var(--font-body)",
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 버튼
// ─────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  fullWidth?: boolean;
}

function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const bgMap = {
    primary: "var(--color-primary)",
    ghost: "var(--color-primary-light)",
    danger: "#e05252",
  };
  const colorMap = {
    primary: "var(--color-text-inverse)",
    ghost: "var(--color-text-primary)",
    danger: "#ffffff",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="fc-pressable"
      style={{
        width: fullWidth ? "100%" : "auto",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-3) var(--space-4)",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: bgMap[variant],
        color: colorMap[variant],
        fontFamily: "var(--font-body)",
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 닉네임 변경 모달
// ─────────────────────────────────────────────
interface NicknameModalProps {
  currentNickname: string;
  onClose: () => void;
  onSubmit: (nickname: string) => Promise<void>;
}

function NicknameModal({
  currentNickname,
  onClose,
  onSubmit,
}: NicknameModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 10) {
      setError("닉네임은 2~10자로 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await onSubmit(trimmed);
      onClose();
    } catch {
      setError("닉네임 변경에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3
        style={{
          fontSize: "var(--text-base)",
          fontWeight: 700,
          marginBottom: "var(--space-4)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
        }}
      >
        닉네임 변경
      </h3>
      <InputField
        label="새 닉네임"
        value={nickname}
        onChange={setNickname}
        placeholder="2~10자로 입력해주세요"
        errorMessage={error}
      />
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginTop: "var(--space-2)",
        }}
      >
        <Button label="취소" onClick={onClose} variant="ghost" fullWidth />
        <Button
          label={loading ? "변경 중..." : "변경"}
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        />
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 비밀번호 변경 모달
// ─────────────────────────────────────────────
interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
}

function PasswordModal({ onClose, onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !newPassword || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않아요.");
      return;
    }
    if (newPassword.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 해요.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await onSubmit(password, newPassword, confirmPassword);
      onClose();
    } catch {
      setError("비밀번호 변경에 실패했어요. 현재 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3
        style={{
          fontSize: "var(--text-base)",
          fontWeight: 700,
          marginBottom: "var(--space-4)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
        }}
      >
        비밀번호 변경
      </h3>
      <InputField
        label="현재 비밀번호"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <InputField
        label="새 비밀번호"
        type="password"
        value={newPassword}
        onChange={setNewPassword}
      />
      <InputField
        label="새 비밀번호 확인"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        errorMessage={error}
      />
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginTop: "var(--space-2)",
        }}
      >
        <Button label="취소" onClick={onClose} variant="ghost" fullWidth />
        <Button
          label={loading ? "변경 중..." : "변경"}
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        />
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 회원탈퇴 확인 모달
// ─────────────────────────────────────────────
interface DeleteModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
}

function DeleteModal({ onClose, onSubmit }: DeleteModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await onSubmit(password);
    } catch {
      setError("비밀번호가 올바르지 않아요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3
        style={{
          fontSize: "var(--text-base)",
          fontWeight: 700,
          marginBottom: "var(--space-2)",
          color: "#e05252",
          fontFamily: "var(--font-body)",
        }}
      >
        회원탈퇴
      </h3>
      <p
        style={{
          fontSize: "var(--text-sm)",
          marginBottom: "var(--space-4)",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-body)",
        }}
      >
        탈퇴하면 모든 데이터가 삭제돼요. 정말 탈퇴하시겠어요?
      </p>
      <InputField
        label="비밀번호 확인"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="현재 비밀번호를 입력해주세요"
        errorMessage={error}
      />
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginTop: "var(--space-2)",
        }}
      >
        <Button label="취소" onClick={onClose} variant="ghost" fullWidth />
        <Button
          label={loading ? "처리 중..." : "탈퇴하기"}
          onClick={handleSubmit}
          variant="danger"
          disabled={loading}
          fullWidth
        />
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트: 월별 스트릭 달력
// - 연속 학습일 표시 포함 (StreakBar 대신 달력 내부에 표시)
// - 달력 이동(이전/다음 달) 시 월별 데이터 표시
// ─────────────────────────────────────────────
interface StreakCalendarProps {
  year: number;
  month: number;
  monthlyStreak: StreakItem[]; // { date: "2026-03-01", checked: true }[]
  currentStreak: number;
  onPrev: () => void;
  onNext: () => void;
}

const MONTH_DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function StreakCalendar({
  year,
  month,
  monthlyStreak,
  currentStreak,
  onPrev,
  onNext,
}: StreakCalendarProps) {
  const { firstDay, daysInMonth } = buildCalendarDays(year, month);

  // 배열 → { 날짜(일): checked } 형태로 변환
  // 예: [{ date: "2026-03-01", checked: true }] → { 1: true }
  const checkedMap = monthlyStreak.reduce<Record<number, boolean>>(
    (acc, item) => {
      acc[extractDay(item.date)] = item.checked;
      return acc;
    },
    {},
  );

  // 달력 격자: 첫째 날 요일만큼 빈 칸 + 날짜 숫자
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4)",
        background: "var(--color-bg-dark)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 헤더: 이전 버튼 / 년+월 / 다음 버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-3)",
        }}
      >
        <button
          onClick={onPrev}
          className="fc-pressable"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.15)",
            color: "var(--color-text-inverse)",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              fontFamily: "var(--font-body)",
            }}
          >
            {year}
          </p>
          {/* fc-font-point: HomeView의 포인트/코인 숫자와 동일한 폰트 */}
          <p
            className="fc-font-point"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 700,
              color: "var(--color-text-inverse)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {month}
          </p>
        </div>
        <button
          onClick={onNext}
          className="fc-pressable"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.15)",
            color: "var(--color-text-inverse)",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>
      </div>

      {/* 연속 학습일 — StreakBar 제거 후 달력 내부로 이동 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          marginBottom: "var(--space-3)",
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-lg)",
          background: "rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ fontSize: "16px" }}>💧</span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          연속 학습{" "}
          <span style={{ color: "var(--color-primary)" }}>
            {currentStreak}일
          </span>
        </span>
      </div>

      {/* 요일 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "var(--space-1)",
        }}
      >
        {MONTH_DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "var(--text-xs)",
              padding: "var(--space-1) 0",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-body)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 격자 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px 0",
        }}
      >
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const done = checkedMap[day] === true;
          return (
            <div
              key={day}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--space-1) 0",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: done ? "16px" : "var(--text-xs)",
                  fontWeight: 500,
                  background: done ? "var(--color-primary)" : "transparent",
                  color: done
                    ? "var(--color-text-inverse)"
                    : "rgba(255,255,255,0.45)",
                  fontFamily: done ? undefined : "var(--font-body)",
                  transition: "var(--transition-fast)",
                }}
              >
                {done ? "⭐" : day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트: MyPageView
// ─────────────────────────────────────────────
export default function MyPageView() {
  const [settingModalOpen, setSettingModalOpen] = useState(false);

  const {
    userInfo,
    characterInfo,
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
  } = useMyPage();

  // ── 로딩 화면 ──
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg)",
        }}
      >
        <div style={{ fontSize: "40px" }}>🐾</div>
      </div>
    );
  }

  // ── 에러 화면 ──
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-3)",
          padding: "var(--space-5)",
          background: "var(--color-bg)",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-sm)",
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="fc-pressable"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const levelOptions: ExerciseLevel[] = [
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ];

  return (
    <>
      {/* ── 페이지 본문 ── */}
      {/* paddingBottom은 AppShellProvider의 <main paddingBottom="80px">에서 이미 처리됨 — 여기서 중복 선언 금지 */}
      <div
        style={{
          background: "var(--color-bg)",
          maxWidth: "430px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* 상단 로고 — public/logo.png */}
        <div
          style={{ padding: "var(--space-5) var(--space-4) var(--space-4)" }}
        >
          <Image
            src="/logo.png"
            alt="FITCOIN 로고"
            width={120}
            height={42}
            priority
            className="fc-logo"
            style={{ objectFit: "contain" }}
          />
        </div>

        <div
          className="fc-hide-scrollbar"
          style={{
            padding: "0 var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {/* ── 프로필 카드 ── */}
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-5)",
              boxShadow: "var(--shadow-sm)",
              background: "var(--color-bg-card)",
              position: "relative",
            }}
          >
            {/* 설정 버튼 */}
            <button
              onClick={() => setSettingModalOpen(true)}
              className="fc-pressable"
              style={{
                position: "absolute",
                top: "var(--space-5)",
                right: "var(--space-5)",
                zIndex: 10,
                color: "var(--color-text-secondary)",
                padding: "var(--space-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Settings size={22} />
            </button>
            {/* 캐릭터 이미지 + 정보 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-4)",
              }}
            >
              {/* 캐릭터 프로필 이미지 */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  background: "var(--color-primary-light)",
                }}
              >
                {/* GET /characters/me 연동 완료 */}
                {characterInfo?.imgUrl ? (
                  <Image
                    src={characterInfo.imgUrl}
                    alt="내 캐릭터"
                    width={72}
                    height={72}
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <span style={{ fontSize: "36px" }}>🐾</span>
                )}
              </div>

              {/* 텍스트 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* 이메일 */}
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    margin: "0 0 var(--space-1)",
                    color: "var(--color-text-disabled)",
                    fontFamily: "var(--font-body)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userInfo?.email}
                </p>

                {/* 닉네임 + 수정 버튼 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 700,
                      margin: 0,
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-body)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userInfo?.nickname}
                  </p>
                  <button
                    onClick={() => setNicknameModalOpen(true)}
                    className="fc-pressable"
                    style={{
                      flexShrink: 0,
                      fontSize: "var(--text-xs)",
                      padding: "var(--space-1) var(--space-2)",
                      borderRadius: "var(--radius-full)",
                      border: "none",
                      cursor: "pointer",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    수정
                  </button>
                </div>

                {/* 로그아웃 / 비밀번호 변경 / 회원탈퇴 */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                  }}
                >
                  {[
                    {
                      label: "로그아웃",
                      onClick: handleLogout,
                      bg: "var(--color-primary-light)",
                      color: "var(--color-text-secondary)",
                    },
                    {
                      label: "비밀번호 변경",
                      onClick: () => setPasswordModalOpen(true),
                      bg: "var(--color-primary-light)",
                      color: "var(--color-text-secondary)",
                    },
                    {
                      label: "회원탈퇴",
                      onClick: () => setDeleteModalOpen(true),
                      bg: "#fde8e8",
                      color: "#e05252",
                    },
                  ].map(({ label, onClick, bg, color }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="fc-pressable"
                      style={{
                        fontSize: "var(--text-xs)",
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-lg)",
                        border: "none",
                        cursor: "pointer",
                        background: bg,
                        color,
                        fontFamily: "var(--font-body)",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 운동 레벨 드롭다운 ── */}
            <div
              style={{
                marginTop: "var(--space-4)",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--color-primary-light)",
                position: "relative",
              }}
            >
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "var(--space-2) var(--space-1)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-body)",
                  transition: "opacity 0.1s ease",
                }}
              >
                <span>레벨재설정</span>
                {/* 현재 레벨 뱃지 — HomeView의 포인트/코인 뱃지 스타일 참고 */}
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    padding: "var(--space-1) var(--space-2)",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-primary)",
                    color: "var(--color-text-inverse)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                  }}
                >
                  {userInfo
                    ? EXERCISE_LEVEL_LABELS[userInfo.exerciseLevel]
                    : ""}
                </span>
                {/* SVG 쉐브론 아이콘 — 열림/닫힘에 따라 180도 회전 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    flexShrink: 0,
                    transform: levelDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {levelDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "40px",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-sm)",
                    zIndex: 10,
                    overflow: "hidden",
                    minWidth: "120px",
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-primary-light)",
                  }}
                >
                  {levelOptions.map((level) => (
                    <button
                      key={level}
                      onClick={async () => {
                        // 1. 드롭다운을 즉시 닫아 사용자가 "클릭됨"을 인지하게 함
                        setLevelDropdownOpen(false);

                        // 2. 실제 업데이트 수행
                        try {
                          await handleLevelUpdate(level);
                        } catch (e) {
                          // 에러 발생 시 처리 (필요 시)
                          console.error("레벨 변경 실패", e);
                        }
                      }}
                      className="fc-pressable"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "var(--space-3) var(--space-4)",
                        fontSize: "var(--text-sm)",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        color:
                          userInfo?.exerciseLevel === level
                            ? "var(--color-primary)"
                            : "var(--color-text-primary)",
                        fontWeight:
                          userInfo?.exerciseLevel === level ? 700 : 400,
                        background:
                          userInfo?.exerciseLevel === level
                            ? "var(--color-primary-light)"
                            : "transparent",
                      }}
                    >
                      {EXERCISE_LEVEL_LABELS[level]}
                      {userInfo?.exerciseLevel === level && " ✓"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 월별 스트릭 달력 ── */}
          <StreakCalendar
            year={calendarDate.year}
            month={calendarDate.month}
            monthlyStreak={monthStreak?.monthlyStreak ?? []}
            currentStreak={
              monthStreak?.currentStreak ?? recentStreak?.currentStreak ?? 0
            }
            onPrev={handleCalendarPrev}
            onNext={handleCalendarNext}
          />
        </div>
      </div>

      {/* ── 모달들 ── */}
      {nicknameModalOpen && userInfo && (
        <NicknameModal
          currentNickname={userInfo.nickname}
          onClose={() => setNicknameModalOpen(false)}
          onSubmit={handleNicknameUpdate}
        />
      )}
      {passwordModalOpen && (
        <PasswordModal
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handlePasswordUpdate}
        />
      )}
      {deleteModalOpen && (
        <DeleteModal
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={handleDeleteUser}
        />
      )}
      {settingModalOpen && (
        <SettingModal onClose={() => setSettingModalOpen(false)} />
      )}
    </>
  );
}
// 이 파일이 하는 일: 마이페이지 전체 화면을 렌더링하는 뷰 컴포넌트다.
// HomeView.tsx 스타일 컨벤션(CSS 변수, fc-pressable, fc-font-point)에 맞게 통일되어 있다.
// 연속 학습일은 월별 달력 내부에 표시한다.
