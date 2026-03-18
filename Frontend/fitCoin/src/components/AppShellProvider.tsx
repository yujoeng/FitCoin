"use client";
// 현재 URL에 따라 탭바를 보여줄지 말지 결정하는 컴포넌트
//
// 수정 내역:
//   - main에 height: 100dvh + overflowY: auto 추가
//     → body 스크롤 대신 main 내부에서만 스크롤 처리
//     → 콘텐츠가 짧으면 스크롤바 없음, 길면 main 안에서만 스크롤
//   - 100dvh: 모바일 주소창(dynamic viewport) 고려한 높이
//     (100vh는 주소창 포함 여부에 따라 높이가 달라지는 모바일 이슈 있음)

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
      <main
        className="fc-hide-scrollbar"
        style={{
          paddingBottom: showTabBar ? "80px" : "0px",
          height: "100dvh",        // 모바일 주소창 포함 뷰포트 높이 (dvh = dynamic viewport height)
          overflowY: "auto",       // 콘텐츠가 길면 main 안에서만 스크롤, body 스크롤 차단
          boxSizing: "border-box", // paddingBottom이 height 안에 포함되도록
        }}
      >
        {children}
      </main>
      {showTabBar && <AppTabBar />}
    </>
  );
}
