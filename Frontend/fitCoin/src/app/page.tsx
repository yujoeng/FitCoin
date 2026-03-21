"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { hasAccessToken } from "@/features/auth/utils/tokenUtils";

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100dvh", backgroundColor: "#FFF8E7" }} />,
});

export default function AppPage() {
  const router = useRouter();

  const handleSplashFinish = useCallback(() => {
    if (hasAccessToken()) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <SplashScreen onFinish={handleSplashFinish} />;
}

// 이 파일이 하는 일: 맨 처음 앱을 켰을 때 스플래시 화면을 띄워주고 시간이 지나면 로그인 여부에 따라 적절한 초기 화면으로 보냅니다.
