// src/app/store/page.tsx
// Next.js App Router — /store 경로 진입점
//
// 현재: mock 데이터로 동작
// TODO: 전역 상태(또는 API)에서 points/coins 를 받아 StoreView에 주입
// TODO: 백엔드 API 연결 후 useEffect에서 초기 자산 데이터 fetch
//
// 연결 파일:
//   - src/views/StoreView.tsx    (실제 화면 렌더링)

'use client';

import { useState } from 'react';
import StoreView from '@/views/StoreView';
import type { UserCharacter } from '@/types/home';

// ─── 초기 자산 mock ───
// TODO: 백엔드 API 연결 후 서버에서 받아온 데이터로 교체
const MOCK_POINTS = 3500;
const MOCK_COINS = 2;
const MOCK_CHARACTER: UserCharacter = {
    id: 'user-char-01',
    characterTypeId: '강아지',
    name: '강아지',
    exp: 4,
    stage: 2,
    imageSrc: '/characters/before/강아지.png',
};

export default function StorePage() {
    // TODO: FitCoinApp.tsx 완성 후 이 state를 위로 올리고 props로 받기
    const [points] = useState<number>(MOCK_POINTS);
    const [coins] = useState<number>(MOCK_COINS);
    const [character] = useState<UserCharacter>(MOCK_CHARACTER);

    return (
        <StoreView
            points={points}
            coins={coins}
            character={character}
        />
    );
}
