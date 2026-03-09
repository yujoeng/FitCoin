// src/types/home.ts
// 홈화면 전반에서 공통으로 사용되는 타입 모음

// ─────────────────────────────────────────
// 가구 슬롯 타입
// ─────────────────────────────────────────

/** 방에 배치되는 5가지 가구 슬롯 */
export type FurnitureSlot =
    | 'wallpaper'   // 벽지
    | 'floor'       // 바닥
    | 'leftItem'    // 좌측 아이템
    | 'rightItem'   // 우측 아이템
    | 'decoration'; // 장식품 (중앙/상단)

/** 하나의 가구 아이템 */
export interface FurnitureItem {
    id: string;
    name: string;
    slot: FurnitureSlot;
    /** 이미지 경로 — 디자이너 파일 전달 시 /public/items/ 하위에 넣고 경로만 교체 */
    imageSrc: string;
    themeId: string;
    /** 구매 재화 종류 */
    type: 'point' | 'coin' | 'hidden';
}

/** 현재 방에 배치된 가구 구성 */
export interface RoomConfig {
    wallpaper: FurnitureItem | null;
    floor: FurnitureItem | null;
    leftItem: FurnitureItem | null;
    rightItem: FurnitureItem | null;
    decoration: FurnitureItem | null;
}

// ─────────────────────────────────────────
// 캐릭터 타입
// ─────────────────────────────────────────

/** 캐릭터 성장 단계 (경험치 기반) */
export type CharacterStage = 1 | 2 | 3;

/** 유저가 보유한 캐릭터 정보 */
export interface UserCharacter {
    id: string;
    characterTypeId: string;
    name: string;
    /** 현재 경험치 (0~10) */
    exp: number;
    stage: CharacterStage;
    /** 홈 화면에 표시할 이미지 (단계별) */
    imageSrc: string;
}

// ─────────────────────────────────────────
// 스트릭 타입
// ─────────────────────────────────────────

/** 하루 스트릭 상태 */
export type StreakDayStatus = 'done' | 'missed' | 'today' | 'future';

export interface StreakDay {
    /** 'Mon' | 'Tue' | ... */
    label: string;
    status: StreakDayStatus;
}

// ─────────────────────────────────────────
// 홈 화면 전체 상태 (FitCoinApp.tsx에서 관리)
// ─────────────────────────────────────────

export interface HomePageState {
    points: number;
    coins: number;
    streakCount: number;
    streakDays: StreakDay[];
    character: UserCharacter | null;
    roomConfig: RoomConfig;
}