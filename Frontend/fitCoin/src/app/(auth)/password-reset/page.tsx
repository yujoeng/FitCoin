"use client";
/**
 * 파일 경로: src/app/(auth)/password-reset/page.tsx
 *
 * 비밀번호 재설정 화면.
 * 이메일 입력 → 재설정 링크 발송 요청 → 안내 문구 표시
 *
 * 연관 파일:
 *  - src/features/auth/services/authApi.ts (requestPasswordReset 함수)
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { requestPasswordReset } from "@/features/auth/services/authApi";

function checkEmail(value: string): string {
  if (!value) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "올바른 이메일 형식이 아니에요.";
  return "";
}

export default function PasswordResetPage() {
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
      setIsSent(true);
    } catch {
      setIsSent(true); // 백엔드 명세: 실패해도 성공으로 표시
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

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
      {/* 뒤로가기 — 고정 */}
      <button
        type="button"
        onClick={() => router.back()}
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
        />
      </div>

      {/* 콘텐츠 영역 */}
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
        {/* 발송 전 */}
        {!isSent ? (
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

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <input
                type="email"
                placeholder="이메일"
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
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              {emailError && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "12px",
                    margin: "0 0 0 4px",
                  }}
                >
                  {emailError}
                </p>
              )}
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
        ) : (
          /* 발송 완료 */
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
            <p style={{ fontSize: "40px", margin: 0 }}>📧</p>
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
        )}
      </div>
    </div>
  );
}
// 이 파일이 하는 일: 이메일 입력 → 재설정 링크 발송 요청 → 완료 안내 화면 표시
