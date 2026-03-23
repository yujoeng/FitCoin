"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppTabBar } from "@/components/AppShell";
import { hasAccessToken } from "@/features/auth/utils/tokenUtils";
import { BgmProvider } from "@/hooks/useBgm";

// 탭바가 필요 없는 페이지 경로 목록
const NO_TABBAR_PATHS = ["/login", "/signup", "/password-reset", "/"];

// 로그인 없이 접근 가능한 페이지 목록
const PUBLIC_PATHS = ["/login", "/signup", "/password-reset", "/"];

// BGM을 끄고 싶은 페이지 목록
const NO_BGM_PATHS = ["/login", "/signup", "/password-reset", "/", "/mission", "/ads"];

export default function AppShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const showTabBar = !NO_TABBAR_PATHS.includes(pathname);
  const isBgmOff = NO_TABBAR_PATHS.includes(pathname) || NO_BGM_PATHS.includes(pathname);

  useEffect(() => {
    setIsMounted(true);

    // [작업 4] 전역 뒤로가기 차단 (PWA 요구사항)
    // 최초 진입 시 현재 상태를 히스토리 스택에 한 번 더 쌓음 (뒤로가기 유도용)
    window.history.pushState({ globalBlock: true }, '', window.location.href);

    const handleGlobalPopState = (event: PopStateEvent) => {
      // 컴포넌트 내부에서 명시적으로 뒤로가기를 허용한 경우 (예: AdPlayer 닫기) 차단하지 않음
      if ((window as any).__FC_ALLOW_BACK__) {
        return;
      }

      // 브라우저/디바이스 뒤로가기 시도 시 다시 pushState하여 현재 위치 고정
      window.history.pushState({ globalBlock: true }, '', window.location.href);
    };

    window.addEventListener('popstate', handleGlobalPopState);

    return () => {
      window.removeEventListener('popstate', handleGlobalPopState);
    };
  }, []);

  // ── 인증 체크 ──────────────────────────────────────────
  // public 페이지가 아닌데 토큰이 없으면 로그인으로 이동
  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!isPublic && !hasAccessToken()) {
      router.replace("/login");
    }
  }, [pathname, router]);
  // ────────────────────────────────────────────────────────

  // 서버와 클라이언트의 최초 렌더링을 완전히 일치시킴 (구조적 하이드레이션 에러 방지)
  return (
    <BgmProvider isPublic={isMounted ? isBgmOff : true}>
      <main
        className="fc-hide-scrollbar"
        style={{
          paddingBottom: (isMounted && showTabBar) ? "calc(80px + var(--safe-bottom))" : "0px",
          height: "100dvh",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
        suppressHydrationWarning
      >
        {children}
      </main>
      {isMounted && showTabBar && <AppTabBar />}
    </BgmProvider>
  );
}
// 이 파일이 하는 일: 탭바 표시 여부 결정 + 로그인 안 된 상태에서 보호된 페이지 접근 시 로그인으로 리다이렉트
