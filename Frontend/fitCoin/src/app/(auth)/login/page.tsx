"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { hasAccessToken } from "@/features/auth/utils/tokenUtils";

const LoginForm = dynamic(
  () => import("@/features/auth/components/LoginForm"),
  { ssr: false, loading: () => <div style={{ height: "300px" }} /> },
);

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100dvh", backgroundColor: "#FFF8E7" }} />,
});

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (hasAccessToken()) {
      router.replace("/home");
    }
  }, [router]);

  return (
    <div
      style={{
        height: "100dvh",
        backgroundColor: "#FFF8E7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px 24px 24px",
        boxSizing: "border-box",
        gap: "12px",
      }}
    >
      {/* 로고 */}
      <Image
        src="/logo.png"
        alt="FITCOIN 로고"
        width={200}
        height={70}
        priority
        style={{ objectFit: "contain" }}
        onError={(e) => {
          e.currentTarget.src = "/icons/error.png";
        }}
      />

      {/* 캐릭터 이미지 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "320px",
          flex: 1,
          maxHeight: "380px",
          minHeight: "200px",
        }}
      >
        <Image
          src="/animals.png"
          alt="캐릭터들"
          fill
          style={{ objectFit: "contain" }}
          priority
          onError={(e) => {
            e.currentTarget.src = "/icons/error.png";
          }}
        />
      </div>

      {/* 로그인 폼 */}
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <LoginForm />

        {/* 회원가입 | 비밀번호 재설정 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/signup")}
            style={{
              background: "none",
              border: "none",
              color: "#96B95B",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            회원가입
          </button>
          <span style={{ color: "#9AA08A", fontSize: "14px" }}>|</span>
          <button
            type="button"
            onClick={() => router.push("/password-reset")}
            style={{
              background: "none",
              border: "none",
              color: "#5C6B4F",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
    </div>
  );
}
// 이 파일이 하는 일: 로고·캐릭터 이미지·LoginForm을 한 화면에 스크롤 없이 배치한다.
