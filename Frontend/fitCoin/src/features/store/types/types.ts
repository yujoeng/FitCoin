// src/features/store/types/store.ts

// ── 상점 아이템 ──

export interface StoreItem {
    name: string;
    description: string;
    priceType: 'POINT' | 'COIN';
    price: number;
}

export interface StoreInfoResult {
    items: StoreItem[];
}

// ── 뽑기 결과 ──

export interface AcquiredFurniture {
    furnitureId: number;
    furnitureType: string;
    themeId: number;
    furnitureName: string;
    imageUrl: string;
}

export interface FurnitureGachaResult {
    spentPoint?: number;  // 포인트 뽑기일 때
    spentCoin?: number;   // 코인 뽑기일 때
    acquiredFurniture: AcquiredFurniture;
}

export interface GifticonItem {
    gifticonId: number;
    gifticonType: string;
    imageUrl: string;
}

export interface GifticonGachaResult {
    spentCoin: number;
    remainingCoin?: number;
    acquiredGifticon: GifticonItem;
}

export interface CharacterRerollResult {
    spentCoin: number;
    remainingCoin: number;
    character: {
        characterId: number;
        characterName: string;
        description: string;
        imageUrl: string;
    };
}

// ── 뽑기 종류 ──

export type GachaType = 'furniture-point' | 'furniture-coin' | 'gifticon' | 'CHARACTER_REROLL';
export type GachaResult = FurnitureGachaResult | GifticonGachaResult | CharacterRerollResult;