"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/services/authApi";
import { saveAccessToken } from "@/features/auth/utils/tokenUtils";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  // ── 입력값 상태 ──────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김

  // ── 에러 메시지 상태 ─────────────────────────
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState(""); // 서버에서 오는 에러

  // ── 로딩 상태 ────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

  // ── 유효성 검사 함수들 ────────────────────────
  // 이메일 형식 확인 (예: abc@gmail.com)
  function checkEmail(value: string): string {
    if (!value) return "이메일을 입력해주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "올바른 이메일 형식이 아니에요.";
    return ""; // 오류 없으면 빈 문자열
  }

  // 비밀번호 형식 확인 (8자 이상)
  function checkPassword(value: string): string {
    if (!value) return "비밀번호를 입력해주세요.";
    if (value.length < 8) return "비밀번호는 8자 이상이어야 해요.";
    return "";
  }

  // ── 로그인 버튼 클릭 ──────────────────────────
  async function handleLogin() {
    // 1. 입력값 유효성 먼저 검사
    const eErr = checkEmail(email);
    const pErr = checkPassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return; // 오류 있으면 여기서 멈춤

    // 2. API 호출
    setApiError("");
    setIsLoading(true);
    try {
      const { accessToken } = await login({ email, password });
      saveAccessToken(accessToken); // 토큰을 localStorage에 저장
      router.push("/home"); // 로그인 성공 → 홈으로 이동
    } catch (err: unknown) {
      // 백엔드 명세: 로그인 에러 메시지는 화면에 그대로 출력 X
      // → 고정된 안내 문구 사용
      setApiError("이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  // Enter 키로도 로그인 가능하게
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  // ── 화면 렌더링 ──────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      {/* 이메일 입력 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          type="email"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            border: `1.5px solid ${emailError ? "#e53e3e" : "#D4D9CC"}`,
            backgroundColor: "#FFFFFF",
            fontSize: "15px",
            color: "#2C3E1F",
            outline: "none",
          }}
        />
        {/* 에러 메시지 (있을 때만 빨간 글씨로 표시) */}
        {emailError && (
          <p
            style={{ color: "#e53e3e", fontSize: "12px", margin: "0 0 0 4px" }}
          >
            {emailError}
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              padding: "14px 48px 14px 16px",
              borderRadius: "12px",
              border: `1.5px solid ${passwordError ? "#e53e3e" : "#D4D9CC"}`,
              backgroundColor: "#FFFFFF",
              fontSize: "15px",
              color: "#2C3E1F",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          {/* 눈 아이콘 — 비밀번호 보이기/숨기기 */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
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
        {passwordError && (
          <p
            style={{ color: "#e53e3e", fontSize: "12px", margin: "0 0 0 4px" }}
          >
            {passwordError}
          </p>
        )}
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

      {/* 로그인 버튼 */}
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          marginTop: "4px",
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
        {isLoading ? "로그인 중..." : "로그인 버튼"}
      </button>
    </div>
  );
}
// 이 컴포넌트가 하는 일: 이메일/비밀번호 입력 → 검증 → 로그인 API 호출 → 토큰 저장 → 홈 이동
