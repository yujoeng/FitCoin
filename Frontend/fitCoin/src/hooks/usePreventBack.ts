"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 모든 페이지에서 브라우저 뒤로가기를 차단하는 커스텀 훅.
 * 동일한 URL의 고스트 히스토리(Ghost History)를 생성하여 브라우저 내비게이션을 가로챕니다.
 * 이 방식은 URL을 전혀 변경하지 않으며(해시 없음), 화면 깜빡임 없이 차단이 가능하게 합니다.
 */
export function usePreventBack() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. 현재 페이지 진입 시, 현재 상태가 '방어용 가짜(ghost) 상태'가 아니라면 하나 더 쌓습니다.
    // [..., /path(실제)] -> [..., /path(실제), /path(가짜)]
    // URL은 동일하게 유지하되 state 객체만 다르게 하여 브라우저를 속입니다.
    if (!window.history.state?.globalBlock) {
      window.history.pushState({ globalBlock: true }, "", window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      // 브라우저 뒤로가기 시도 시: 
      // /path(가짜) -> /path(실제) 로 이동하게 됨.
      // URL이 같으므로 Next.js의 내비게이션이 트리거되지 않아 깜빡임이 없습니다.
      // 우리는 조용히 pushState를 호출하여 가짜 상태를 다시 복구합니다 (동기 호출로 반응 지연 제거).
      if (!window.history.state?.globalBlock) {
        window.history.pushState({ globalBlock: true }, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);
}
