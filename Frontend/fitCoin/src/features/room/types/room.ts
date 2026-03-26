/** 가구 종류 (API furnitureType) */
export type FurnitureType =
  | 'WALLPAPER'
  | 'FLOOR'
  | 'WINDOW'
  | 'LEFT'
  | 'RIGHT'
  | 'HIDDEN';

/** 획득 방법 */
export type AcquireType = 'POINT' | 'COIN' | 'HIDDEN';

/** 인벤토리 가구 1개 */
export interface FurnitureItem {
  furnitureId: number;
  furnitureType: FurnitureType;
  themeId: number;
  furnitureName: string;
  imageUrl: string;
  acquireType: AcquireType;
  owned: boolean; // GET /rooms/inventory 응답에 포함 여부로 프론트에서 판단
}

/** GET /rooms 응답 */
export interface RoomLayoutResponse {
  wallpaper: { furnitureId: number; imageUrl: string } | null;
  floor: { furnitureId: number; imageUrl: string } | null;
  window: { furnitureId: number; imageUrl: string } | null;
  left: { furnitureId: number; imageUrl: string } | null;
  right: { furnitureId: number; imageUrl: string } | null;
  hidden: { furnitureId: number; imageUrl: string } | null;
}

/** PUT /rooms 요청 */
export interface RoomLayoutRequest {
  wallpaperId: number | null;
  floorId: number | null;
  windowId: number | null;
  leftId: number | null;
  rightId: number | null;
  decorationId: number | null;
}

/** PUT /rooms 응답 */
export interface RoomLayoutUpdateResponse {
  room: {
    wallpaper: number | null;
    floor: number | null;
    window: number | null;
    left: number | null;
    right: number | null;
    hidden: number | null;
  };
}

/** GET /rooms/inventory 응답 */
export interface InventoryResponse {
  furnitures: FurnitureItem[];
}
