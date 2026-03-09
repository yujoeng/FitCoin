// src/app/home/page.tsx
// Next.js App Router — /home 경로 진입점
//
// 현재: mock 데이터로 동작
// TODO: FitCoinApp.tsx 구현 후 전역 상태에서 props로 받는 방식으로 전환
// TODO: 백엔드 API 연결 후 useEffect에서 초기 데이터 fetch
//
// 연결 파일:
//   - src/views/HomeView.tsx     (실제 화면 렌더링)
//   - src/data/roomThemes.ts     (초기 방 구성 mock)
//   - src/types/home.ts          (HomePageState 타입)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeView from '@/views/HomeView';
import { DEFAULT_ROOM_CONFIG } from '@/data/roomThemes';
import type { HomePageState, StreakDay } from '@/types/home';

// ─── 임시 스트릭 mock 데이터 생성 ───
// TODO: 백엔드 API 연결 후 제거
function createMockStreakDays(): StreakDay[] {
    const labels = ['월', '화', '수', '목', '금', '토', '일'];
    const statuses: StreakDay['status'][] = ['done', 'done', 'done', 'done', 'today', 'future', 'future'];
    return labels.map((label, i) => ({ label, status: statuses[i] }));
}

// ─── 초기 상태 mock ───
// TODO: 백엔드 API 연결 후 서버에서 받아온 데이터로 교체
const INITIAL_STATE: HomePageState = {
    points: 3500,
    coins: 2,
    streakCount: 4,
    streakDays: createMockStreakDays(),
    character: {
        id: 'user-char-01',
        characterTypeId: 'hedgehog',
        name: '고슴도치',
        exp: 4,
        stage: 2,
        imageSrc: '', // TODO: '/characters/hedgehog/stage2.png'
    },
    roomConfig: DEFAULT_ROOM_CONFIG,
};

export default function HomePage() {
    const router = useRouter();

    // TODO: FitCoinApp.tsx 완성 후 이 state를 위로 올리고 props로 받기
    const [homeState] = useState<HomePageState>(INITIAL_STATE);

    return (
        <HomeView
            state={homeState}
            onGoMission={() => router.push('/mission')}
            // TODO: 미션 페이지 라우트 확정 후 경로 확인
            onEditRoom={() => router.push('/room')}
            // TODO: 방 꾸미기 라우트 확정 후 경로 확인
            onWatchAd={() => alert('광고 시청 (추후 구현)')}
            onGoExchange={() => router.push('/exchange')}
            // TODO: 환전소 라우트 확정 후 경로 확인
            onGoStore={() => router.push('/store')}
            // TODO: 상점/인벤토리 라우트 확정 후 경로 확인
            onGoSettings={() => alert('설정 (추후 구현)')}
            // TODO: 설정 모달 또는 페이지 라우트 확정 후 교체
            onViewCalendar={() => router.push('/my')}
        // TODO: 마이페이지 라우트 확정 후 경로 확인
        />
    );
}