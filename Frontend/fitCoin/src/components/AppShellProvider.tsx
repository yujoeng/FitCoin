"use client";
// 현재 URL에 따라 탭바를 보여줄지 말지 결정하는 컴포넌트

import { usePathname } from "next/navigation";
import { AppTabBar } from "@/components/AppShell";

// 탭바가 필요 없는 페이지 경로 목록
const NO_TABBAR_PATHS = ["/login", "/signup", "/password-reset", "/"];

export default function AppShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabBar = !NO_TABBAR_PATHS.includes(pathname);

  return (
    <>
      <main style={{ paddingBottom: showTabBar ? "80px" : "0px" }}>
        {children}
      </main>
      {showTabBar && <AppTabBar />}
    </>
  );
}
