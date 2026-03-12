// src/app/page.tsx
// 앱 진입 페이지: 스플래시 화면을 띄우고 토큰 유무에 따라 라우팅 분기 처리

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';
import { hasAccessToken } from '@/features/auth/utils/tokenUtils';

export default function AppPage() {
    const router = useRouter();

    const handleSplashFinish = useCallback(() => {
        // TODO: 추후 POST /auth/reissue 호출로 실제 토큰 유효성 검증 추가 예정
        if (hasAccessToken()) {
            // replace 사용 이유: 뒤로가기로 스플래시 재진입 방지
            router.replace('/home');
        } else {
            router.replace('/login');
        }
    }, [router]);

    return <SplashScreen onFinish={handleSplashFinish} />;
}

// 이 파일이 하는 일: 맨 처음 앱을 켰을 때 스플래시 화면을 띄워주고 시간이 지나면 로그인 여부에 따라 적절한 초기 화면으로 보냅니다.
