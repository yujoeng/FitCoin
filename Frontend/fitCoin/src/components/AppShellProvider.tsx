"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppTabBar } from "@/components/AppShell";
import { hasAccessToken } from "@/features/auth/utils/tokenUtils";

// 탭바가 필요 없는 페이지 경로 목록
const NO_TABBAR_PATHS = ["/login", "/signup", "/password-reset", "/"];

// 로그인 없이 접근 가능한 페이지 목록
const PUBLIC_PATHS = ["/login", "/signup", "/password-reset", "/"];

export default function AppShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const showTabBar = !NO_TABBAR_PATHS.includes(pathname);

  // ── 인증 체크 ──────────────────────────────────────────
  // public 페이지가 아닌데 토큰이 없으면 로그인으로 이동
  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!isPublic && !hasAccessToken()) {
      router.replace("/login");
    }
  }, [pathname, router]);
  // ────────────────────────────────────────────────────────

  return (
    <>
      <main
        className="fc-hide-scrollbar"
        style={{
          paddingBottom: showTabBar ? "80px" : "0px",
          height: "100dvh",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
      {showTabBar && <AppTabBar />}
    </>
  );
}
// 이 파일이 하는 일: 탭바 표시 여부 결정 + 로그인 안 된 상태에서 보호된 페이지 접근 시 로그인으로 리다이렉트
