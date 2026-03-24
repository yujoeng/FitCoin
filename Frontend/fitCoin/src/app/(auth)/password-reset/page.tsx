"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, CheckCircle2 } from "lucide-react";
import {
  requestPasswordReset,
  resetPassword,
} from "@/features/auth/services/authApi";

// ── 유효성 검사 ──────────────────────────────────
function checkEmail(value: string): string {
  if (!value) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "올바른 이메일 형식이 아니에요.";
  return "";
}

function checkPassword(value: string): string {
  if (!value) return "비밀번호를 입력해주세요.";
  if (value.length < 8) return "비밀번호는 8자 이상이어야 해요.";
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value);
  if ([hasLetter, hasNumber, hasSpecial].filter(Boolean).length < 2)
    return "영문, 숫자, 특수문자 중 2가지 이상을 포함해야 해요.";
  return "";
}

// ── 공통 스타일 ────────────────────────────────
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

const errorText: React.CSSProperties = {
  color: "#e53e3e",
  fontSize: "12px",
  margin: "0 0 0 4px",
};

// ── Step 1: 이메일 입력 → 링크 발송 ──────────────
function StepRequestEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit() {
    const err = checkEmail(email);
    setEmailError(err);
    if (err) return;

    setIsLoading(true);
    try {
      await requestPasswordReset({ email });
    } catch {
      // 백엔드 명세: 없는 이메일이어도 성공으로 표시
    } finally {
      setIsSent(true);
      setIsLoading(false);
    }
  }

  if (isSent) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Mail size={48} color="#96B95B" />
        <p
          style={{
            color: "#2C3E1F",
            fontSize: "16px",
            fontWeight: 700,
            textAlign: "center",
            margin: 0,
          }}
        >
          이메일을 확인해주세요!
        </p>
        <p
          style={{
            color: "#5C6B4F",
            fontSize: "14px",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {email} 로<br />
          비밀번호 재설정 링크를 보냈어요.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{
            marginTop: "8px",
            padding: "15px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#96B95B",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          로그인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "360px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p
        style={{
          color: "#5C6B4F",
          fontSize: "14px",
          textAlign: "center",
          margin: "0 0 8px 0",
        }}
      >
        가입한 이메일을 입력하면
        <br />
        비밀번호 재설정 링크를 보내드려요.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.nativeEvent.isComposing &&
            !isLoading &&
            handleSubmit()
          }
          style={inputStyle(!!emailError)}
        />
        {emailError && <p style={errorText}>{emailError}</p>}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          padding: "15px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: isLoading ? "#9AA08A" : "#96B95B",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "전송 중..." : "재설정 링크 전송"}
      </button>
    </div>
  );
}

// ── Step 2: 새 비밀번호 입력 (링크 클릭 후) ────────
function StepResetPassword({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirm: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit() {
    const pwErr = checkPassword(password);
    const confirmErr =
      password !== confirmPassword ? "비밀번호가 일치하지 않아요." : "";
    setErrors({ password: pwErr, confirm: confirmErr });
    if (pwErr || confirmErr) return;

    setApiError("");
    setIsLoading(true);
    try {
      await resetPassword({ password, confirmPassword, token });
      setIsDone(true);
    } catch {
      setApiError("비밀번호 재설정에 실패했어요. 링크가 만료됐을 수 있어요.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isDone) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <CheckCircle2 size={48} color="#96B95B" />
        <p
          style={{
            color: "#2C3E1F",
            fontSize: "16px",
            fontWeight: 700,
            textAlign: "center",
            margin: 0,
          }}
        >
          비밀번호가 변경됐어요!
        </p>
        <button
          type="button"
          onClick={() => router.replace("/login")}
          style={{
            marginTop: "8px",
            padding: "15px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#96B95B",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "360px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p
        style={{
          color: "#5C6B4F",
          fontSize: "14px",
          textAlign: "center",
          margin: "0 0 8px 0",
        }}
      >
        새로운 비밀번호를 입력해주세요.
      </p>

      {/* 새 비밀번호 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPw ? "text" : "password"}
            placeholder="새 비밀번호 (8자 이상, 2종류 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              !isLoading &&
              handleSubmit()
            }
            style={{ ...inputStyle(!!errors.password), paddingRight: "48px" }}
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
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
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p style={errorText}>{errors.password}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPwConfirm ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              !isLoading &&
              handleSubmit()
            }
            style={{ ...inputStyle(!!errors.confirm), paddingRight: "48px" }}
          />
          <button
            type="button"
            onClick={() => setShowPwConfirm((p) => !p)}
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
            {showPwConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirm && <p style={errorText}>{errors.confirm}</p>}
      </div>

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

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          padding: "15px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: isLoading ? "#9AA08A" : "#96B95B",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "변경 중..." : "비밀번호 변경"}
      </button>
    </div>
  );
}

// ── 콘텐츠 (useSearchParams 사용하는 부분 분리) ──
function PasswordResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <>
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => {
          (window as any).__FC_ALLOW_BACK__ = true;
          router.back();
        }}
        style={{
          position: "absolute",
          top: "16px",
          left: "24px",
          background: "none",
          border: "none",
          color: "#2C3E1F",
          fontSize: "22px",
          cursor: "pointer",
          padding: "4px",
          lineHeight: 1,
          zIndex: 10,
        }}
      >
        {"<"}
      </button>

      {/* 로고 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "60px",
          flexShrink: 0,
        }}
      >
        <Image
          src="/logo.png"
          alt="FITCOIN 로고"
          width={140}
          height={50}
          priority
          style={{ objectFit: "contain" }}
          onError={(e) => {
            e.currentTarget.src = "/icons/error.png";
          }}
        />
      </div>

      {/* 콘텐츠 */}
      <div
        style={{
          flex: 1,
          padding: "8px 24px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {token ? (
          <StepResetPassword token={token} />
        ) : (
          <StepRequestEmail />
        )}
      </div>
    </>
  );
}

// ── 페이지 본체 ────────────────────────────────
export default function PasswordResetPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#FFF8E7",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* useSearchParams()는 반드시 Suspense 안에 있어야 함 (Next.js 14 정적 생성 요건) */}
      <Suspense fallback={null}>
        <PasswordResetContent />
      </Suspense>
    </div>
  );
}
// 이 파일이 하는 일:
// Step 1 (token 없음): 이메일 입력 → POST /auth/password/reset-request → 링크 발송 안내
// Step 2 (token 있음): 새 비밀번호 입력 → PATCH /auth/password/reset → 완료 안내
