import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/index';
import {
  RoomLayoutResponse,
  RoomLayoutRequest,
  RoomLayoutUpdateResponse,
  InventoryResponse,
} from '../types/room';

/** 현재 가구 배치 상태 조회 — GET /rooms */
export const getRoomLayout = async (): Promise<ApiResponse<RoomLayoutResponse>> => {
  const response = await apiClient.get('/rooms');
  return response.data;
};

/** 가구 배치 상태 변경 — PUT /rooms */
export const updateRoomLayout = async (req: RoomLayoutRequest): Promise<ApiResponse<RoomLayoutUpdateResponse>> => {
  const response = await apiClient.put('/rooms', req);
  return response.data;
};

/** 전체 가구 목록 조회 (도감 용도) — GET /rooms/inventory */
export const getRoomInventory = async (): Promise<ApiResponse<InventoryResponse>> => {
  const response = await apiClient.get('/rooms/inventory');
  return response.data;
};
