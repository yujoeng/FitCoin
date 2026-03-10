// src/data/roomThemes.ts
// 방 테마 및 가구 정적 데이터
//
// TODO: 백엔드 API 연결 후 services/furnitureService.ts 로 이전
// 연결 파일:
//   - src/types/home.ts         (FurnitureItem, RoomConfig 타입)
//   - src/components/RoomView.tsx  (RoomConfig 사용)
//   - src/app/home/page.tsx        (DEFAULT_ROOM_CONFIG 사용)

import type { FurnitureItem, RoomConfig } from '@/types/home';

// ─── 1. 아쿠아 테마 가구 목록 ───
// 파일 위치: public/rooms/aqua/
export const AQUA_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 'aqua-wallpaper', name: '아쿠아 벽지', slot: 'wallpaper', imageSrc: '/rooms/aqua/벽지-아쿠아.png', themeId: 'aqua', type: 'point' },
    { id: 'aqua-floor', name: '아쿠아 바닥재', slot: 'floor', imageSrc: '/rooms/aqua/바닥재-아쿠아.png', themeId: 'aqua', type: 'point' },
    { id: 'aqua-window', name: '아쿠아 창문', slot: 'window', imageSrc: '/rooms/aqua/창문-아쿠아.png', themeId: 'aqua', type: 'point' },
    { id: 'aqua-leftItem', name: '수영 타월 & 오리발', slot: 'leftItem', imageSrc: '/rooms/aqua/오브젝트1-아쿠아.png', themeId: 'aqua', type: 'coin' },
    { id: 'aqua-rightItem', name: '수영모 & 물병', slot: 'rightItem', imageSrc: '/rooms/aqua/오브젝트2-아쿠아.png', themeId: 'aqua', type: 'coin' },
    { id: 'aqua-decoration', name: 'SWIM ZONE 네온사인', slot: 'decoration', imageSrc: '/rooms/aqua/장식품-아쿠아.png', themeId: 'aqua', type: 'point' },
];

// ─── 2. 머슬 테마 가구 목록 ───
// 파일 위치: public/rooms/muscle/
export const MUSCLE_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 'muscle-wallpaper', name: '머슬 벽지', slot: 'wallpaper', imageSrc: '/rooms/muscle/벽지-머슬.png', themeId: 'muscle', type: 'point' },
    { id: 'muscle-floor', name: '머슬 바닥재', slot: 'floor', imageSrc: '/rooms/muscle/바닥재-머슬.png', themeId: 'muscle', type: 'point' },
    { id: 'muscle-window', name: '머슬 창문', slot: 'window', imageSrc: '/rooms/muscle/창문-머슬.png', themeId: 'muscle', type: 'point' },
    { id: 'muscle-leftItem', name: '머슬 오브젝트 1', slot: 'leftItem', imageSrc: '/rooms/muscle/오브젝트1-머슬.png', themeId: 'muscle', type: 'coin' },
    { id: 'muscle-rightItem', name: '머슬 오브젝트 2', slot: 'rightItem', imageSrc: '/rooms/muscle/오브젝트2-머슬.png', themeId: 'muscle', type: 'coin' },
    { id: 'muscle-decoration', name: '머슬 장식품', slot: 'decoration', imageSrc: '/rooms/muscle/장식품-머슬.png', themeId: 'muscle', type: 'point' },
];

// ─── 3. 아웃도어 테마 가구 목록 ───
// 파일 위치: public/rooms/outdoor/
export const OUTDOOR_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 'outdoor-wallpaper', name: '아웃도어 벽지', slot: 'wallpaper', imageSrc: '/rooms/outdoor/벽지-아웃도어.png', themeId: 'outdoor', type: 'point' },
    { id: 'outdoor-floor', name: '아웃도어 바닥재', slot: 'floor', imageSrc: '/rooms/outdoor/바닥재-아웃도어.png', themeId: 'outdoor', type: 'point' },
    { id: 'outdoor-window', name: '아웃도어 창문', slot: 'window', imageSrc: '/rooms/outdoor/창문-아웃도어.png', themeId: 'outdoor', type: 'point' },
    { id: 'outdoor-leftItem', name: '아웃도어 오브젝트 1', slot: 'leftItem', imageSrc: '/rooms/outdoor/오브젝트1-아웃도어.png', themeId: 'outdoor', type: 'coin' },
    { id: 'outdoor-rightItem', name: '아웃도어 오브젝트 2', slot: 'rightItem', imageSrc: '/rooms/outdoor/오브젝트2-아웃도어.png', themeId: 'outdoor', type: 'coin' },
    { id: 'outdoor-decoration', name: '아웃도어 장식품', slot: 'decoration', imageSrc: '/rooms/outdoor/장식품-아웃도어.png', themeId: 'outdoor', type: 'point' },
];

// ─── 4. 큐트 테마 가구 목록 ───
// 파일 위치: public/rooms/cute/
export const CUTE_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 'cute-wallpaper', name: '큐트 벽지', slot: 'wallpaper', imageSrc: '/rooms/cute/벽지-큐트.png', themeId: 'cute', type: 'point' },
    { id: 'cute-floor', name: '큐트 바닥재', slot: 'floor', imageSrc: '/rooms/cute/바닥재-큐트.png', themeId: 'cute', type: 'point' },
    { id: 'cute-window', name: '큐트 창문', slot: 'window', imageSrc: '/rooms/cute/창문-큐트.png', themeId: 'cute', type: 'point' },
    { id: 'cute-leftItem', name: '큐트 오브젝트 1', slot: 'leftItem', imageSrc: '/rooms/cute/오브젝트1-큐트.png', themeId: 'cute', type: 'coin' },
    { id: 'cute-rightItem', name: '큐트 오브젝트 2', slot: 'rightItem', imageSrc: '/rooms/cute/오브젝트2-큐트.png', themeId: 'cute', type: 'coin' },
    { id: 'cute-decoration', name: '큐트 장식품', slot: 'decoration', imageSrc: '/rooms/cute/장식품-큐트.png', themeId: 'cute', type: 'point' },
];

// ─── 5. 러닝 테마 가구 목록 ───
// 파일 위치: public/rooms/running/
export const RUNNING_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 'running-wallpaper', name: '러닝 벽지', slot: 'wallpaper', imageSrc: '/rooms/running/벽지-러닝.png', themeId: 'running', type: 'point' },
    { id: 'running-floor', name: '러닝 바닥재', slot: 'floor', imageSrc: '/rooms/running/바닥재-러닝.png', themeId: 'running', type: 'point' },
    { id: 'running-window', name: '러닝 창문', slot: 'window', imageSrc: '/rooms/running/창문-러닝.png', themeId: 'running', type: 'point' },
    { id: 'running-leftItem', name: '러닝 오브젝트 1', slot: 'leftItem', imageSrc: '/rooms/running/오브젝트1-러닝.png', themeId: 'running', type: 'coin' },
    { id: 'running-rightItem', name: '러닝 오브젝트 2', slot: 'rightItem', imageSrc: '/rooms/running/오브젝트2-러닝.png', themeId: 'running', type: 'coin' },
    { id: 'running-decoration', name: '러닝 장식품', slot: 'decoration', imageSrc: '/rooms/running/장식품-러닝.png', themeId: 'running', type: 'point' },
];


// ─── 전체 가구 목록 ───
export const ALL_FURNITURE_ITEMS: FurnitureItem[] = [
    ...AQUA_FURNITURE_ITEMS,
    ...MUSCLE_FURNITURE_ITEMS,
    ...OUTDOOR_FURNITURE_ITEMS,
    ...CUTE_FURNITURE_ITEMS,
    ...RUNNING_FURNITURE_ITEMS,
];

// ─── 테마별 방 기본 구성 (RoomConfig 템플릿) ───
export const AQUA_ROOM_CONFIG: RoomConfig = {
    wallpaper: AQUA_FURNITURE_ITEMS.find(f => f.slot === 'wallpaper') ?? null,
    floor: AQUA_FURNITURE_ITEMS.find(f => f.slot === 'floor') ?? null,
    window: AQUA_FURNITURE_ITEMS.find(f => f.slot === 'window') ?? null,
    leftItem: AQUA_FURNITURE_ITEMS.find(f => f.slot === 'leftItem') ?? null,
    rightItem: AQUA_FURNITURE_ITEMS.find(f => f.slot === 'rightItem') ?? null,
    decoration: AQUA_FURNITURE_ITEMS.find(f => f.slot === 'decoration') ?? null,
};

export const MUSCLE_ROOM_CONFIG: RoomConfig = {
    wallpaper: MUSCLE_FURNITURE_ITEMS.find(f => f.slot === 'wallpaper') ?? null,
    floor: MUSCLE_FURNITURE_ITEMS.find(f => f.slot === 'floor') ?? null,
    window: MUSCLE_FURNITURE_ITEMS.find(f => f.slot === 'window') ?? null,
    leftItem: MUSCLE_FURNITURE_ITEMS.find(f => f.slot === 'leftItem') ?? null,
    rightItem: MUSCLE_FURNITURE_ITEMS.find(f => f.slot === 'rightItem') ?? null,
    decoration: MUSCLE_FURNITURE_ITEMS.find(f => f.slot === 'decoration') ?? null,
};

export const OUTDOOR_ROOM_CONFIG: RoomConfig = {
    wallpaper: OUTDOOR_FURNITURE_ITEMS.find(f => f.slot === 'wallpaper') ?? null,
    floor: OUTDOOR_FURNITURE_ITEMS.find(f => f.slot === 'floor') ?? null,
    window: OUTDOOR_FURNITURE_ITEMS.find(f => f.slot === 'window') ?? null,
    leftItem: OUTDOOR_FURNITURE_ITEMS.find(f => f.slot === 'leftItem') ?? null,
    rightItem: OUTDOOR_FURNITURE_ITEMS.find(f => f.slot === 'rightItem') ?? null,
    decoration: OUTDOOR_FURNITURE_ITEMS.find(f => f.slot === 'decoration') ?? null,
};

export const CUTE_ROOM_CONFIG: RoomConfig = {
    wallpaper: CUTE_FURNITURE_ITEMS.find(f => f.slot === 'wallpaper') ?? null,
    floor: CUTE_FURNITURE_ITEMS.find(f => f.slot === 'floor') ?? null,
    window: CUTE_FURNITURE_ITEMS.find(f => f.slot === 'window') ?? null,
    leftItem: CUTE_FURNITURE_ITEMS.find(f => f.slot === 'leftItem') ?? null,
    rightItem: CUTE_FURNITURE_ITEMS.find(f => f.slot === 'rightItem') ?? null,
    decoration: CUTE_FURNITURE_ITEMS.find(f => f.slot === 'decoration') ?? null,
};

export const RUNNING_ROOM_CONFIG: RoomConfig = {
    wallpaper: RUNNING_FURNITURE_ITEMS.find(f => f.slot === 'wallpaper') ?? null,
    floor: RUNNING_FURNITURE_ITEMS.find(f => f.slot === 'floor') ?? null,
    window: RUNNING_FURNITURE_ITEMS.find(f => f.slot === 'window') ?? null,
    leftItem: RUNNING_FURNITURE_ITEMS.find(f => f.slot === 'leftItem') ?? null,
    rightItem: RUNNING_FURNITURE_ITEMS.find(f => f.slot === 'rightItem') ?? null,
    decoration: RUNNING_FURNITURE_ITEMS.find(f => f.slot === 'decoration') ?? null,
};

// ─── 처음 앱을 실행했을 때 홈화면에 보여줄 기본 방 ───
// 나중에 다른 테마 구성을 확인하고 싶을 때 아래 값을 변수로 변경해보세요 (예: MUSCLE_ROOM_CONFIG)
export const DEFAULT_ROOM_CONFIG: RoomConfig = CUTE_ROOM_CONFIG;