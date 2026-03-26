// src/features/store/services/storeApi.ts

import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/index';
import {
    StoreInfoResult,
    FurnitureGachaResult,
    GifticonGachaResult,
    CharacterRerollResult,
} from '@/features/store/types/types';

// 상점 아이템 목록 조회 — GET /shop/items
export const getStoreInfo = async (): Promise<ApiResponse<StoreInfoResult>> => {
    const response = await apiClient.get('/shop/items');
    return response.data;
};

// 포인트 가구 랜덤 뽑기 — POST /shop/gacha/furniture/point
export const gachaFurniturePoint = async (): Promise<ApiResponse<FurnitureGachaResult>> => {
    const response = await apiClient.post('/shop/gacha/furniture/point');
    return response.data;
};

// 코인 가구 랜덤 뽑기 — POST /shop/gacha/furniture/coin
export const gachaFurnitureCoin = async (): Promise<ApiResponse<FurnitureGachaResult>> => {
    const response = await apiClient.post('/shop/gacha/furniture/coin');
    return response.data;
};

// 기프티콘 뽑기 — POST /shop/gacha/gifticon
export const gachaGifticon = async (): Promise<ApiResponse<GifticonGachaResult>> => {
    const response = await apiClient.post('/shop/gacha/gifticon');
    return response.data;
};

// 캐릭터 리롤 — POST /character/reroll
export const rerollCharacter = async (): Promise<ApiResponse<CharacterRerollResult>> => {
    const response = await apiClient.post('/character/reroll');
    return response.data;
};