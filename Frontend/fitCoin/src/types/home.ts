// ─────────────────────────────────────────
// 가구 슬롯 타입
// ─────────────────────────────────────────

/** 방에 배치되는 6가지 가구 슬롯 */
export type FurnitureSlot =
    | 'wallpaper'   // 벽지
    | 'floor'       // 바닥
    | 'window'      // 창문
    | 'left'        // 아이템1
    | 'right'       // 아이템2
    | 'hidden';     // 장식품

/** 하나의 가구 아이템 */
export interface FurnitureItem {
    id: number;
    name: string;
    slot: FurnitureSlot;
    /** 이미지 경로 */
    imageUrl: string;
    themeId: string;
    /** 구매 재화 종류 */
    acquireType: 'POINT' | 'COIN' | 'HIDDEN';
}

/** 현재 방에 배치된 가구 구성 */
export interface RoomConfig {
    wallpaper: FurnitureItem | null;
    floor: FurnitureItem | null;
    window: FurnitureItem | null;
    left: FurnitureItem | null;
    right: FurnitureItem | null;
    hidden: FurnitureItem | null;
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
    isGraduatable: boolean;
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