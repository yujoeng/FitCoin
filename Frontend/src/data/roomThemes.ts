// src/data/roomThemes.ts
// 테마별 가구 구성 정적 데이터
// ※ 이미지 경로는 디자이너 파일 전달 후 /public/items/ 경로로 교체할 것
// TODO: 백엔드 API 연결 후 이 파일 대신 services/furnitureService.ts 에서 데이터 수신

import type { FurnitureItem, RoomConfig } from '@/types/home';

// ─────────────────────────────────────────
// 아이템 목록 (인벤토리 mock)
// ─────────────────────────────────────────

export const MOCK_FURNITURE_ITEMS: FurnitureItem[] = [
    // 테마 1 — 헬스장 테마
    {
        id: 'wp-gym-01',
        name: '아령 무늬 벽지',
        slot: 'wallpaper',
        imageSrc: '', // TODO: '/items/wallpaper/gym-wallpaper.png'
        themeId: 'gym',
        type: 'point',
    },
    {
        id: 'fl-gym-01',
        name: '타일 바닥재',
        slot: 'floor',
        imageSrc: '', // TODO: '/items/floor/gym-tile.png'
        themeId: 'gym',
        type: 'point',
    },
    {
        id: 'lt-gym-01',
        name: '요가 매트',
        slot: 'leftItem',
        imageSrc: '', // TODO: '/items/items/yoga-mat.png'
        themeId: 'gym',
        type: 'point',
    },
    {
        id: 'rt-gym-01',
        name: '덤벨 세트',
        slot: 'rightItem',
        imageSrc: '', // TODO: '/items/items/dumbbell.png'
        themeId: 'gym',
        type: 'coin',
    },
    {
        id: 'dc-gym-01',
        name: '창문 + 커튼',
        slot: 'decoration',
        imageSrc: '', // TODO: '/items/deco/window-curtain.png'
        themeId: 'gym',
        type: 'point',
    },

    // 테마 2 — 꽃무늬 테마
    {
        id: 'wp-flower-01',
        name: '잔꽃무늬 벽지',
        slot: 'wallpaper',
        imageSrc: '', // TODO: '/items/wallpaper/flower-wallpaper.png'
        themeId: 'flower',
        type: 'point',
    },
    {
        id: 'fl-flower-01',
        name: '원목 바닥재',
        slot: 'floor',
        imageSrc: '', // TODO: '/items/floor/wood-floor.png'
        themeId: 'flower',
        type: 'point',
    },
];

// ─────────────────────────────────────────
// 기본 방 구성 (초기 상태)
// ─────────────────────────────────────────

export const DEFAULT_ROOM_CONFIG: RoomConfig = {
    wallpaper: MOCK_FURNITURE_ITEMS.find((i) => i.id === 'wp-gym-01') ?? null,
    floor: MOCK_FURNITURE_ITEMS.find((i) => i.id === 'fl-gym-01') ?? null,
    leftItem: MOCK_FURNITURE_ITEMS.find((i) => i.id === 'lt-gym-01') ?? null,
    rightItem: MOCK_FURNITURE_ITEMS.find((i) => i.id === 'rt-gym-01') ?? null,
    decoration: MOCK_FURNITURE_ITEMS.find((i) => i.id === 'dc-gym-01') ?? null,
};

// ─────────────────────────────────────────
// 테마 메타 정보
// ─────────────────────────────────────────

export const THEMES = [
    { id: 'gym', name: '헬스장', color: '#A8C5F0' },
    { id: 'flower', name: '꽃무늬', color: '#F0A8C5' },
    { id: 'wood', name: '원목', color: '#C5B08A' },
    { id: 'neon', name: '네온', color: '#A8F0D4' },
    { id: 'cute', name: '큐트', color: '#F0D4A8' },
] as const;