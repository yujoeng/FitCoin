import type { FurnitureItem, RoomConfig } from '@/types/home';

const MINIO = process.env.NEXT_PUBLIC_MINIO_URL ?? '';

// ─── 1. 큐트 테마 (themeId: cute, DB id: 1~6) ───
export const CUTE_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 1,  name: '큐트 바닥',   slot: 'floor',     imageUrl: `${MINIO}/theme/cute%2Ffloor.png`,      themeId: 'cute', acquireType: 'POINT' },
    { id: 2,  name: '큐트 벽지',   slot: 'wallpaper', imageUrl: `${MINIO}/theme/cute%2Fwallpaper.png`,  themeId: 'cute', acquireType: 'POINT' },
    { id: 3,  name: '요가매트',    slot: 'left',      imageUrl: `${MINIO}/theme/cute%2Fleft_item.png`,  themeId: 'cute', acquireType: 'COIN'  },
    { id: 4,  name: '덤벨',        slot: 'right',     imageUrl: `${MINIO}/theme/cute%2Fright_item.png`, themeId: 'cute', acquireType: 'COIN'  },
    { id: 5,  name: '큐트 히든템', slot: 'hidden',    imageUrl: `${MINIO}/theme/cute%2Fhidden.png`,     themeId: 'cute', acquireType: 'POINT' },
    { id: 6,  name: '큐트 창문',   slot: 'window',    imageUrl: `${MINIO}/theme/cute%2Fwindow.png`,     themeId: 'cute', acquireType: 'POINT' },
];

// ─── 2. 머슬 테마 (themeId: muscle, DB id: 7~12) ───
export const MUSCLE_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 7,  name: '머슬 바닥',   slot: 'floor',     imageUrl: `${MINIO}/theme/muscle%2Ffloor.png`,      themeId: 'muscle', acquireType: 'POINT' },
    { id: 8,  name: '머슬 벽지',   slot: 'wallpaper', imageUrl: `${MINIO}/theme/muscle%2Fwallpaper.png`,  themeId: 'muscle', acquireType: 'POINT' },
    { id: 9,  name: '덤벨랙',      slot: 'left',      imageUrl: `${MINIO}/theme/muscle%2Fleft_item.png`,  themeId: 'muscle', acquireType: 'COIN'  },
    { id: 10, name: '프로틴',      slot: 'right',     imageUrl: `${MINIO}/theme/muscle%2Fright_item.png`, themeId: 'muscle', acquireType: 'COIN'  },
    { id: 11, name: '머슬 히든템', slot: 'hidden',    imageUrl: `${MINIO}/theme/muscle%2Fhidden.png`,     themeId: 'muscle', acquireType: 'POINT' },
    { id: 12, name: '머슬 창문',   slot: 'window',    imageUrl: `${MINIO}/theme/muscle%2Fwindow.png`,     themeId: 'muscle', acquireType: 'POINT' },
];

// ─── 3. 러닝 테마 (themeId: running, DB id: 13~18) ───
export const RUNNING_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 13, name: '러닝 바닥',   slot: 'floor',     imageUrl: `${MINIO}/theme/running%2Ffloor.png`,      themeId: 'running', acquireType: 'POINT' },
    { id: 14, name: '러닝 벽지',   slot: 'wallpaper', imageUrl: `${MINIO}/theme/running%2Fwallpaper.png`,  themeId: 'running', acquireType: 'POINT' },
    { id: 15, name: '러닝화',      slot: 'left',      imageUrl: `${MINIO}/theme/running%2Fleft_item.png`,  themeId: 'running', acquireType: 'COIN'  },
    { id: 16, name: '암밴드',      slot: 'right',     imageUrl: `${MINIO}/theme/running%2Fright_item.png`, themeId: 'running', acquireType: 'COIN'  },
    { id: 17, name: '러닝 히든템', slot: 'hidden',    imageUrl: `${MINIO}/theme/running%2Fhidden.png`,     themeId: 'running', acquireType: 'POINT' },
    { id: 18, name: '러닝 창문',   slot: 'window',    imageUrl: `${MINIO}/theme/running%2Fwindow.png`,     themeId: 'running', acquireType: 'POINT' },
];

// ─── 4. 캠핑 테마 (themeId: camping, DB id: 19~24) ───
export const CAMPING_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 19, name: '캠핑 바닥',   slot: 'floor',     imageUrl: `${MINIO}/theme/camping%2Ffloor.png`,      themeId: 'camping', acquireType: 'POINT' },
    { id: 20, name: '캠핑 벽지',   slot: 'wallpaper', imageUrl: `${MINIO}/theme/camping%2Fwallpaper.png`,  themeId: 'camping', acquireType: 'POINT' },
    { id: 21, name: '침낭',        slot: 'left',      imageUrl: `${MINIO}/theme/camping%2Fleft_item.png`,  themeId: 'camping', acquireType: 'COIN'  },
    { id: 22, name: '캠프파이어',  slot: 'right',     imageUrl: `${MINIO}/theme/camping%2Fright_item.png`, themeId: 'camping', acquireType: 'COIN'  },
    { id: 23, name: '캠핑 히든템', slot: 'hidden',    imageUrl: `${MINIO}/theme/camping%2Fhidden.png`,     themeId: 'camping', acquireType: 'POINT' },
    { id: 24, name: '캠핑 창문',   slot: 'window',    imageUrl: `${MINIO}/theme/camping%2Fwindow.png`,     themeId: 'camping', acquireType: 'POINT' },
];

// ─── 5. 아쿠아 테마 (themeId: aqua, DB id: 25~30) ───
export const AQUA_FURNITURE_ITEMS: FurnitureItem[] = [
    { id: 25, name: '아쿠아 바닥',   slot: 'floor',     imageUrl: `${MINIO}/theme/aqua%2Ffloor.png`,      themeId: 'aqua', acquireType: 'POINT' },
    { id: 26, name: '아쿠아 벽지',   slot: 'wallpaper', imageUrl: `${MINIO}/theme/aqua%2Fwallpaper.png`,  themeId: 'aqua', acquireType: 'POINT' },
    { id: 27, name: '오리발',        slot: 'left',      imageUrl: `${MINIO}/theme/aqua%2Fleft_item.png`,  themeId: 'aqua', acquireType: 'COIN'  },
    { id: 28, name: '수영모',        slot: 'right',     imageUrl: `${MINIO}/theme/aqua%2Fright_item.png`, themeId: 'aqua', acquireType: 'COIN'  },
    { id: 29, name: '아쿠아 히든템', slot: 'hidden',    imageUrl: `${MINIO}/theme/aqua%2Fhidden.png`,     themeId: 'aqua', acquireType: 'POINT' },
    { id: 30, name: '아쿠아 창문',   slot: 'window',    imageUrl: `${MINIO}/theme/aqua%2Fwindow.png`,     themeId: 'aqua', acquireType: 'POINT' },
];

export const ALL_FURNITURE_ITEMS: FurnitureItem[] = [
    ...CUTE_FURNITURE_ITEMS,
    ...MUSCLE_FURNITURE_ITEMS,
    ...RUNNING_FURNITURE_ITEMS,
    ...CAMPING_FURNITURE_ITEMS,
    ...AQUA_FURNITURE_ITEMS,
];

const createRoomConfig = (items: FurnitureItem[]): RoomConfig => ({
    wallpaper: items.find(f => f.slot === 'wallpaper') ?? null,
    floor:     items.find(f => f.slot === 'floor')     ?? null,
    window:    items.find(f => f.slot === 'window')    ?? null,
    left:      items.find(f => f.slot === 'left')      ?? null,
    right:     items.find(f => f.slot === 'right')     ?? null,
    hidden:    items.find(f => f.slot === 'hidden')    ?? null,
});

export const CUTE_ROOM_CONFIG    = createRoomConfig(CUTE_FURNITURE_ITEMS);
export const MUSCLE_ROOM_CONFIG  = createRoomConfig(MUSCLE_FURNITURE_ITEMS);
export const RUNNING_ROOM_CONFIG = createRoomConfig(RUNNING_FURNITURE_ITEMS);
export const CAMPING_ROOM_CONFIG = createRoomConfig(CAMPING_FURNITURE_ITEMS);
export const AQUA_ROOM_CONFIG    = createRoomConfig(AQUA_FURNITURE_ITEMS);

// 이전 호환성: OUTDOOR → CAMPING으로 변경됨
export const OUTDOOR_FURNITURE_ITEMS = CAMPING_FURNITURE_ITEMS;
export const OUTDOOR_ROOM_CONFIG     = CAMPING_ROOM_CONFIG;

export const DEFAULT_ROOM_CONFIG: RoomConfig = CUTE_ROOM_CONFIG;