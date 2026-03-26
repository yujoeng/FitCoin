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

// ── 운동 레벨 옵션 (백엔드 Enum 명세 반영) ──
const EXERCISE_LEVELS = [
  { value: "BEGINNER", label: "초급 — 운동 거의 안 해요" },
  { value: "INTERMEDIATE", label: "중급 — 가끔 하는 편이에요" },
  { value: "ADVANCED", label: "고급 — 꾸준히 운동해요" },
] as const;

type ExerciseLevel = (typeof EXERCISE_LEVELS)[number]["value"];

// ── 유효성 검사 (명세 반영) ──
function checkEmail(value: string): string {
  if (!value) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "올바른 이메일 형식이 아니에요.";
  return "";
}

function checkNickname(value: string): string {
  if (!value) return "닉네임을 입력해주세요.";
  // 한글, 영문, 숫자 조합 체크 로직 추가 가능
  if (value.length < 2 || value.length > 10)
    return "닉네임은 2~10자로 입력해주세요.";
  return "";
}

function checkPassword(value: string): string {
  if (!value) return "비밀번호를 입력해주세요.";
  // 영문, 숫자, 특수문자 중 2종류 이상 포함 체크 (간단한 예시)
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const typesCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  if (value.length < 8) return "비밀번호는 8자 이상이어야 해요.";
  if (typesCount < 2)
    return "영문, 숫자, 특수문자 중 2종류 이상 포함해야 해요.";
  return "";
}

function checkPasswordConfirm(password: string, confirm: string): string {
  if (!confirm) return "비밀번호 확인을 입력해주세요.";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다.";
  return "";
}

// ── 스타일 정의 ──
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
    boxSizing: "border-box",
  };
}

const errorText: React.CSSProperties = {
  color: "#e53e3e",
  fontSize: "12px",
  margin: "0 0 0 4px",
};

export default function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [exerciseLevel, setExerciseLevel] = useState<ExerciseLevel>("BEGINNER");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    code: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [apiError, setApiError] = useState("");

  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);

  async function handleSendCode() {
    if (isLoadingSend) return;
    const emailErr = checkEmail(email);
    setErrors((prev) => ({ ...prev, email: emailErr }));
    if (emailErr) return;

    setApiError("");
    setIsLoadingSend(true);
    try {
      await requestEmailVerification({ email });
      setIsCodeSent(true);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: "이미 가입된 이메일이에요." }));
      } else {
        setApiError("인증 코드 발송에 실패했어요.");
      }
    } finally {
      setIsLoadingSend(false);
    }
  }

  async function handleVerifyCode() {
    if (isLoadingVerify) return;
    if (!code) {
      setErrors((prev) => ({ ...prev, code: "인증 코드를 입력해주세요." }));
      return;
    }

    setApiError("");
    setIsLoadingVerify(true);
    try {
      const { token } = await confirmEmailVerification({ email, code });
      setVerifyToken(token);
      setIsEmailVerified(true);
    } catch {
      setErrors((prev) => ({ ...prev, code: "인증 코드가 올바르지 않아요." }));
    } finally {
      setIsLoadingVerify(false);
    }
  }

  async function handleSignup() {
    if (isLoadingSignup) return;
    if (!isEmailVerified) {
      setApiError("이메일 인증을 완료해주세요.");
      return;
    }

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
        exerciseLevel: exerciseLevel,
        token: verifyToken,
      });

      // 2. 자동 로그인
      const { accessToken } = await login({ email, password });
      saveAccessToken(accessToken);

      router.replace("/home");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setApiError("이미 사용 중인 닉네임이거나 가입된 정보입니다.");
      } else {
        setApiError("회원가입 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoadingSignup(false);
    }
  }

  // Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      action();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      {/* 이메일 인증 영역 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSendCode)}
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
            }}
          >
            {isEmailVerified
              ? "인증완료"
              : isLoadingSend
                ? "발송 중"
                : "인증하기"}
          </button>
        </div>
        {errors.email && <p style={errorText}>{errors.email}</p>}
      </div>

      {/* 인증코드 입력 영역 */}
      {isCodeSent && !isEmailVerified && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="인증번호 6자리"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleVerifyCode)}
              maxLength={6}
              style={{ ...inputStyle(!!errors.code), flex: 1 }}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isLoadingVerify}
              style={{
                padding: "0 16px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#96B95B",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isLoadingVerify ? "확인 중" : "인증"}
            </button>
          </div>
          {errors.code && <p style={errorText}>{errors.code}</p>}
        </div>
      )}

      {/* 정보 입력 영역 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          type="text"
          placeholder="닉네임 (2~10자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, handleSignup)}
          style={inputStyle(!!errors.nickname)}
        />
        {errors.nickname && <p style={errorText}>{errors.nickname}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 (8자 이상, 영문/숫자/특수문자 조합)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
            style={{ ...inputStyle(!!errors.password), paddingRight: "48px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showPassword ? (
              <EyeOff size={18} color="#9AA08A" />
            ) : (
              <Eye size={18} color="#9AA08A" />
            )}
          </button>
        </div>
        {errors.password && <p style={errorText}>{errors.password}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPasswordConfirm ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
            style={{
              ...inputStyle(!!errors.passwordConfirm),
              paddingRight: "48px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showPasswordConfirm ? (
              <EyeOff size={18} color="#9AA08A" />
            ) : (
              <Eye size={18} color="#9AA08A" />
            )}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p style={errorText}>{errors.passwordConfirm}</p>
        )}
      </div>

      {/* 운동 레벨 선택 영역 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginTop: "4px",
        }}
      >
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
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {apiError && (
        <p
          style={{
            color: "#e53e3e",
            fontSize: "13px",
            textAlign: "center",
            backgroundColor: "#fff5f5",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          {apiError}
        </p>
      )}

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
        {isLoadingSignup ? "가입 처리 중..." : "회원가입"}
      </button>
    </div>
  );
}
