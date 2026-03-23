import type { FurnitureItem, RoomConfig } from '@/types/home';

// ─── 1. 아쿠아 테마 가구 목록 ───
export const AQUA_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 101, name: '아쿠아 벽지', slot: 'wallpaper', imageUrl: '/rooms/aqua/벽지-아쿠아.png', themeId: 'aqua', acquireType: 'POINT' },
    { id: 102, name: '아쿠아 바닥재', slot: 'floor', imageUrl: '/rooms/aqua/바닥재-아쿠아.png', themeId: 'aqua', acquireType: 'POINT' },
    { id: 103, name: '아쿠아 창문', slot: 'window', imageUrl: '/rooms/aqua/창문-아쿠아.png', themeId: 'aqua', acquireType: 'POINT' },
    { id: 104, name: '수영 타월 & 오리발', slot: 'left', imageUrl: '/rooms/aqua/오브젝트1-아쿠아.png', themeId: 'aqua', acquireType: 'COIN' },
    { id: 105, name: '수영모 & 물병', slot: 'right', imageUrl: '/rooms/aqua/오브젝트2-아쿠아.png', themeId: 'aqua', acquireType: 'COIN' },
    { id: 106, name: 'SWIM ZONE 네온사인', slot: 'hidden', imageUrl: '/rooms/aqua/장식품-아쿠아.png', themeId: 'aqua', acquireType: 'POINT' },
];

// ─── 2. 머슬 테마 가구 목록 ───
export const MUSCLE_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 201, name: '머슬 벽지', slot: 'wallpaper', imageUrl: '/rooms/muscle/벽지-머슬.png', themeId: 'muscle', acquireType: 'POINT' },
    { id: 202, name: '머슬 바닥재', slot: 'floor', imageUrl: '/rooms/muscle/바닥재-머슬.png', themeId: 'muscle', acquireType: 'POINT' },
    { id: 203, name: '머슬 창문', slot: 'window', imageUrl: '/rooms/muscle/창문-머슬.png', themeId: 'muscle', acquireType: 'POINT' },
    { id: 204, name: '머슬 오브젝트 1', slot: 'left', imageUrl: '/rooms/muscle/오브젝트1-머슬.png', themeId: 'muscle', acquireType: 'COIN' },
    { id: 205, name: '머슬 오브젝트 2', slot: 'right', imageUrl: '/rooms/muscle/오브젝트2-머슬.png', themeId: 'muscle', acquireType: 'COIN' },
    { id: 206, name: '머슬 장식품', slot: 'hidden', imageUrl: '/rooms/muscle/장식품-머슬.png', themeId: 'muscle', acquireType: 'POINT' },
];

export const OUTDOOR_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 301, name: '아웃도어 벽지', slot: 'wallpaper', imageUrl: '/rooms/outdoor/벽지-아웃도어.png', themeId: 'outdoor', acquireType: 'POINT' },
    { id: 302, name: '아웃도어 바닥재', slot: 'floor', imageUrl: '/rooms/outdoor/바닥재-아웃도어.png', themeId: 'outdoor', acquireType: 'POINT' },
    { id: 303, name: '아웃도어 창문', slot: 'window', imageUrl: '/rooms/outdoor/창문-아웃도어.png', themeId: 'outdoor', acquireType: 'POINT' },
    { id: 304, name: '아웃도어 오브젝트 1', slot: 'left', imageUrl: '/rooms/outdoor/오브젝트1-아웃도어.png', themeId: 'outdoor', acquireType: 'COIN' },
    { id: 305, name: '아웃도어 오브젝트 2', slot: 'right', imageUrl: '/rooms/outdoor/오브젝트2-아웃도어.png', themeId: 'outdoor', acquireType: 'COIN' },
    { id: 306, name: '아웃도어 장식품', slot: 'hidden', imageUrl: '/rooms/outdoor/장식품-아웃도어.png', themeId: 'outdoor', acquireType: 'POINT' },
];

export const CUTE_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 401, name: '큐트 벽지', slot: 'wallpaper', imageUrl: '/rooms/cute/벽지-큐트.png', themeId: 'cute', acquireType: 'POINT' },
    { id: 402, name: '큐트 바닥재', slot: 'floor', imageUrl: '/rooms/cute/바닥재-큐트.png', themeId: 'cute', acquireType: 'POINT' },
    { id: 403, name: '큐트 창문', slot: 'window', imageUrl: '/rooms/cute/창문-큐트.png', themeId: 'cute', acquireType: 'POINT' },
    { id: 404, name: '큐트 오브젝트 1', slot: 'left', imageUrl: '/rooms/cute/오브젝트1-큐트.png', themeId: 'cute', acquireType: 'COIN' },
    { id: 405, name: '큐트 오브젝트 2', slot: 'right', imageUrl: '/rooms/cute/오브젝트2-큐트.png', themeId: 'cute', acquireType: 'COIN' },
    { id: 406, name: '큐트 장식품', slot: 'hidden', imageUrl: '/rooms/cute/장식품-큐트.png', themeId: 'cute', acquireType: 'POINT' },
];

export const RUNNING_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 501, name: '러닝 벽지', slot: 'wallpaper', imageUrl: '/rooms/running/벽지-러닝.png', themeId: 'running', acquireType: 'POINT' },
    { id: 502, name: '러닝 바닥재', slot: 'floor', imageUrl: '/rooms/running/바닥재-러닝.png', themeId: 'running', acquireType: 'POINT' },
    { id: 503, name: '러닝 창문', slot: 'window', imageUrl: '/rooms/running/창문-러닝.png', themeId: 'running', acquireType: 'POINT' },
    { id: 504, name: '러닝 오브젝트 1', slot: 'left', imageUrl: '/rooms/running/오브젝트1-러닝.png', themeId: 'running', acquireType: 'COIN' },
    { id: 505, name: '러닝 오브젝트 2', slot: 'right', imageUrl: '/rooms/running/오브젝트2-러닝.png', themeId: 'running', acquireType: 'COIN' },
    { id: 506, name: '러닝 장식품', slot: 'hidden', imageUrl: '/rooms/running/장식품-러닝.png', themeId: 'running', acquireType: 'POINT' },
];

export const ALL_FURNITURE_ITEMS: FurnitureItem[] = [
    ...AQUA_FURNITURE_ITEMS,
    ...MUSCLE_FURNITURE_ITEMS,
    ...OUTDOOR_FURNITURE_ITEMS,
    ...CUTE_FURNITURE_ITEMS,
    ...RUNNING_FURNITURE_ITEMS,
];

const createRoomConfig = (items: FurnitureItem[]): RoomConfig => ({
    wallpaper: items.find(f => f.slot === 'wallpaper') ?? null,
    floor: items.find(f => f.slot === 'floor') ?? null,
    window: items.find(f => f.slot === 'window') ?? null,
    left: items.find(f => f.slot === 'left') ?? null,
    right: items.find(f => f.slot === 'right') ?? null,
    hidden: items.find(f => f.slot === 'hidden') ?? null,
});

export const AQUA_ROOM_CONFIG = createRoomConfig(AQUA_FURNITURE_ITEMS);
export const MUSCLE_ROOM_CONFIG = createRoomConfig(MUSCLE_FURNITURE_ITEMS);
export const OUTDOOR_ROOM_CONFIG = createRoomConfig(OUTDOOR_FURNITURE_ITEMS);
export const CUTE_ROOM_CONFIG = createRoomConfig(CUTE_FURNITURE_ITEMS);
export const RUNNING_ROOM_CONFIG = createRoomConfig(RUNNING_FURNITURE_ITEMS);

export const DEFAULT_ROOM_CONFIG: RoomConfig = CUTE_ROOM_CONFIG;