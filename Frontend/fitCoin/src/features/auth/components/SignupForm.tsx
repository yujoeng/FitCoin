"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  requestEmailVerification,
  confirmEmailVerification,
  signup,
  login,
} from "@/features/auth/services/authApi";
import { saveAccessToken } from "@/features/auth/utils/tokenUtils";

// ── 운동 레벨 옵션 ──────────────────────────────
const EXERCISE_LEVELS = [
  { value: "low", label: "초급 — 운동 거의 안 해요" },
  { value: "middle", label: "중급 — 가끔 하는 편이에요" },
  { value: "high", label: "고급 — 꾸준히 운동해요" },
] as const;

type ExerciseLevel = "low" | "middle" | "high";

// ── 유효성 검사 함수들 ──────────────────────────
function checkEmail(value: string): string {
  if (!value) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "올바른 이메일 형식이 아니에요.";
  return "";
}

function checkNickname(value: string): string {
  if (!value) return "닉네임을 입력해주세요.";
  if (value.length < 2 || value.length > 10)
    return "닉네임은 2~10자로 입력해주세요.";
  return "";
}

function checkPassword(value: string): string {
  if (!value) return "비밀번호를 입력해주세요.";
  if (value.length < 8) return "비밀번호는 8자 이상이어야 해요.";
  return "";
}

function checkPasswordConfirm(password: string, confirm: string): string {
  if (!confirm) return "비밀번호 확인을 입력해주세요.";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다.";
  return "";
}

// ── 공통 인풋 스타일 ────────────────────────────
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${hasError ? "#e53e3e" : "#D4D9CC"}`,
    backgroundColor: "#FFFFFF",
    fontSize: "15px",
    color: "#2C3E1F",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  };
}

// ── 에러 텍스트 스타일 ──────────────────────────
const errorText: React.CSSProperties = {
  color: "#e53e3e",
  fontSize: "12px",
  margin: "0 0 0 4px",
};

export default function SignupForm() {
  const router = useRouter();

  // ── 입력값 상태 ──
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [exerciseLevel, setExerciseLevel] = useState<ExerciseLevel>("low");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // ── 이메일 인증 상태 ──
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증코드 발송 완료
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 인증 완료
  const [verifyToken, setVerifyToken] = useState(""); // 인증 완료 후 받은 token

  // ── 에러 메시지 상태 ──
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [apiError, setApiError] = useState("");

  // ── 로딩 상태 ──
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);

  // ── 인증 코드 발송 ──────────────────────────────
  async function handleSendCode() {
    const emailErr = checkEmail(email);
    setErrors((prev) => ({ ...prev, email: emailErr }));
    if (emailErr) return;

    setApiError("");
    setIsLoadingSend(true);
    try {
      await requestEmailVerification({ email });
      setIsCodeSent(true);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: "이미 가입된 이메일이에요." }));
      } else {
        setApiError("인증 코드 발송에 실패했어요. 다시 시도해주세요.");
      }
    } finally {
      setIsLoadingSend(false);
    }
  }

  // ── 인증 코드 확인 ──────────────────────────────
  async function handleVerifyCode() {
    if (!code) {
      setErrors((prev) => ({ ...prev, code: "인증 코드를 입력해주세요." }));
      return;
    }

    setApiError("");
    setIsLoadingVerify(true);
    try {
      const { token } = await confirmEmailVerification({ email, code });
      setVerifyToken(token); // 회원가입 때 필요한 token 저장
      setIsEmailVerified(true);
    } catch {
      setErrors((prev) => ({ ...prev, code: "인증 코드가 올바르지 않아요." }));
    } finally {
      setIsLoadingVerify(false);
    }
  }

  // ── 회원가입 제출 ───────────────────────────────
  async function handleSignup() {
    // 이메일 인증 확인
    if (!isEmailVerified) {
      setApiError("이메일 인증을 완료해주세요.");
      return;
    }

    // 유효성 검사
    const nicknameErr = checkNickname(nickname);
    const passwordErr = checkPassword(password);
    const passwordConfirmErr = checkPasswordConfirm(password, passwordConfirm);
    setErrors((prev) => ({
      ...prev,
      nickname: nicknameErr,
      password: passwordErr,
      passwordConfirm: passwordConfirmErr,
    }));
    if (nicknameErr || passwordErr || passwordConfirmErr) return;

    setApiError("");
    setIsLoadingSignup(true);
    try {
      // 1. 회원가입
      await signup({
        email,
        nickname,
        password,
        confirmPassword: passwordConfirm,
        exercise_level: exerciseLevel,
        token: verifyToken,
      });

      // 2. 회원가입 성공 후 자동 로그인 (백엔드 명세)
      const { accessToken } = await login({ email, password });
      saveAccessToken(accessToken);

      // 3. 홈으로 이동
      router.replace("/home");
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 409) {
        setApiError("이미 사용 중인 이메일이에요.");
      } else {
        setApiError("회원가입에 실패했어요. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsLoadingSignup(false);
    }
  }

  // ── 화면 렌더링 ─────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      {/* ① 이메일 + 인증하기 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            placeholder="이메일 입력칸"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailVerified}
            style={{ ...inputStyle(!!errors.email), flex: 1 }}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isLoadingSend || isEmailVerified}
            style={{
              flexShrink: 0,
              padding: "0 16px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: isEmailVerified ? "#A8C577" : "#96B95B",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isEmailVerified ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {isEmailVerified
              ? "인증완료 ✓"
              : isLoadingSend
                ? "발송 중..."
                : "인증하기"}
          </button>
        </div>
        {errors.email && <p style={errorText}>{errors.email}</p>}
      </div>

      {/* ② 인증 코드 입력 (발송 후 && 인증 전에만 표시) */}
      {isCodeSent && !isEmailVerified && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="인증번호 입력칸"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              style={{ ...inputStyle(!!errors.code), flex: 1 }}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isLoadingVerify}
              style={{
                flexShrink: 0,
                padding: "0 16px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#96B95B",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {isLoadingVerify ? "확인 중..." : "인증"}
            </button>
          </div>
          {errors.code && <p style={errorText}>{errors.code}</p>}
        </div>
      )}

      {/* ③ 닉네임 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          type="text"
          placeholder="닉네임 (2~10자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={10}
          style={inputStyle(!!errors.nickname)}
        />
        {errors.nickname && <p style={errorText}>{errors.nickname}</p>}
      </div>

      {/* ④ 비밀번호 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle(!!errors.password), paddingRight: "48px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA08A",
              display: "flex",
              alignItems: "center",
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p style={errorText}>{errors.password}</p>}
      </div>

      {/* ⑤ 비밀번호 확인 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPasswordConfirm ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            style={{
              ...inputStyle(!!errors.passwordConfirm),
              paddingRight: "48px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((p) => !p)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA08A",
              display: "flex",
              alignItems: "center",
            }}
          >
            {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p style={errorText}>{errors.passwordConfirm}</p>
        )}
      </div>

      {/* ⑥ 운동 레벨 선택 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <p
          style={{ color: "#5C6B4F", fontSize: "13px", margin: "0 0 2px 4px" }}
        >
          하루에 운동 얼마나 하시나요?
        </p>
        {EXERCISE_LEVELS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setExerciseLevel(value)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: `2px solid ${exerciseLevel === value ? "#96B95B" : "#D4D9CC"}`,
              backgroundColor: exerciseLevel === value ? "#F0F7E0" : "#FFFFFF",
              color: exerciseLevel === value ? "#2C3E1F" : "#5C6B4F",
              fontSize: "14px",
              fontWeight: exerciseLevel === value ? 600 : 400,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 서버 에러 메시지 */}
      {apiError && (
        <p
          style={{
            color: "#e53e3e",
            fontSize: "13px",
            textAlign: "center",
            margin: 0,
            padding: "8px",
            backgroundColor: "#fff5f5",
            borderRadius: "8px",
          }}
        >
          {apiError}
        </p>
      )}

      {/* 회원가입 버튼 */}
      <button
        type="button"
        onClick={handleSignup}
        disabled={isLoadingSignup}
        style={{
          marginTop: "4px",
          padding: "15px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: isLoadingSignup ? "#9AA08A" : "#96B95B",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 700,
          cursor: isLoadingSignup ? "not-allowed" : "pointer",
        }}
      >
        {isLoadingSignup ? "가입 중..." : "회원가입"}
      </button>
    </div>
  );
}
// 이 컴포넌트가 하는 일: 이메일 인증 → 정보 입력 → 운동레벨 선택 → 회원가입 API → 자동 로그인 → 홈 이동
