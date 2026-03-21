import { useState, useCallback, useMemo } from 'react';
import {
  getRoomLayout,
  getRoomInventory,
  updateRoomLayout
} from '../services/roomApi';
import {
  RoomLayoutResponse,
  RoomLayoutRequest,
  FurnitureItem as APIFurnitureItem,
  FurnitureType
} from '../types/room';
import { RoomConfig, FurnitureItem as HomeFurnitureItem } from '@/types/home';

/**
 * RoomLayoutResponse를 RoomConfig 타입으로 변환 (RoomView 렌더링용)
 */
export function convertLayoutToRoomConfig(layout: RoomLayoutResponse | null | undefined): RoomConfig {
  if (!layout) {
    return {
      wallpaper: null,
      floor: null,
      window: null,
      left: null,
      right: null,
      hidden: null,
    };
  }

  // 가구 1개를 HomeFurnitureItem 형식으로 변환하는 내부 헬퍼
  const toHomeItem = (item: { furnitureId: number; imageUrl: string } | null, slot: any): HomeFurnitureItem | null => {
    if (!item) return null;
    return {
      id: item.furnitureId,
      name: '',
      slot,
      imageUrl: item.imageUrl,
      themeId: '0',
      acquireType: 'POINT', // 기본값
    };
  };

  return {
    wallpaper: toHomeItem(layout.wallpaper, 'wallpaper'),
    floor: toHomeItem(layout.floor, 'floor'),
    window: toHomeItem(layout.window, 'window'),
    left: toHomeItem(layout.left, 'left'),
    right: toHomeItem(layout.right, 'right'),
    hidden: toHomeItem(layout.hidden, 'hidden'),
  };
}

// FurnitureType → RoomLayoutRequest 키 매핑
export function toRequestKey(type: FurnitureType): keyof RoomLayoutRequest {
  const map: Record<FurnitureType, keyof RoomLayoutRequest> = {
    WALLPAPER: 'wallpaperId',
    FLOOR: 'floorId',
    WINDOW: 'windowId',
    LEFT: 'leftId',
    RIGHT: 'rightId',
    HIDDEN: 'decorationId',
  };
  return map[type];
}

const useRoom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentLayout, setCurrentLayout] = useState<RoomLayoutResponse | null>(null);
  const [editingLayout, setEditingLayout] = useState<RoomLayoutRequest>({
    wallpaperId: null,
    floorId: null,
    windowId: null,
    leftId: null,
    rightId: null,
    decorationId: null,
  });
  const [inventory, setInventory] = useState<APIFurnitureItem[]>([]);

  /**
   * 실시간 미리보기를 위한 레이아웃 계산 (이미지 URL 포함)
   */
  const previewLayout = useMemo((): RoomLayoutResponse | null => {
    const findFurniture = (id: number | null) => {
      if (id === null) return null;
      const item = inventory.find((f) => f.furnitureId === id);
      return item ? { furnitureId: item.furnitureId, imageUrl: item.imageUrl } : null;
    };

    return {
      wallpaper: findFurniture(editingLayout.wallpaperId),
      floor: findFurniture(editingLayout.floorId),
      window: findFurniture(editingLayout.windowId),
      left: findFurniture(editingLayout.leftId),
      right: findFurniture(editingLayout.rightId),
      hidden: findFurniture(editingLayout.decorationId),
    };
  }, [editingLayout, inventory]);

  /**
   * 전체 데이터 로드 (배치 + 인벤토리)
   */
  const loadRoom = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [layoutRes, inventoryRes] = await Promise.all([
        getRoomLayout(),
        getRoomInventory(),
      ]);

      if (layoutRes.isSuccess && layoutRes.result) {
        setCurrentLayout(layoutRes.result);
        setEditingLayout({
          wallpaperId: layoutRes.result.wallpaper?.furnitureId ?? null,
          floorId: layoutRes.result.floor?.furnitureId ?? null,
          windowId: layoutRes.result.window?.furnitureId ?? null,
          leftId: layoutRes.result.left?.furnitureId ?? null,
          rightId: layoutRes.result.right?.furnitureId ?? null,
          decorationId: layoutRes.result.hidden?.furnitureId ?? null,
        });
      }

      if (inventoryRes.isSuccess && inventoryRes.result) {
        setInventory(inventoryRes.result.furnitures.map(f => ({ ...f, owned: true })));
      } else {
        setError(inventoryRes.message || '가구 목록을 불러오지 못했어요.');
      }
    } catch (err: any) {
      console.error('Room data load failed:', err);
      setError('가구 배치를 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 가구 선택 (미리보기용)
   */
  const selectFurniture = useCallback((type: FurnitureType, furnitureId: number | null) => {
    const key = toRequestKey(type);
    setEditingLayout((prev) => ({
      ...prev,
      [key]: furnitureId,
    }));
  }, []);

  /**
   * 레이아웃 저장
   */
  const saveLayout = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await updateRoomLayout(editingLayout);
      if (response.isSuccess) {
        const newLayout = await getRoomLayout();
        if (newLayout.isSuccess && newLayout.result) {
          setCurrentLayout(newLayout.result);
        }
      } else {
        setError(response.message || '가구 배치를 저장하지 못했어요.');
      }
    } catch (err: any) {
      console.error('Room layout save failed:', err);
      setError('가구 배치를 저장하지 못했어요.');
    } finally {
      setIsSaving(false);
    }
  }, [editingLayout]);

  /**
   * 편집 취소 (초기화)
   */
  const resetEditing = useCallback(() => {
    if (!currentLayout) return;
    setEditingLayout({
      wallpaperId: currentLayout.wallpaper?.furnitureId ?? null,
      floorId: currentLayout.floor?.furnitureId ?? null,
      windowId: currentLayout.window?.furnitureId ?? null,
      leftId: currentLayout.left?.furnitureId ?? null,
      rightId: currentLayout.right?.furnitureId ?? null,
      decorationId: currentLayout.hidden?.furnitureId ?? null,
    });
  }, [currentLayout]);

  return {
    isLoading,
    isSaving,
    error,
    currentLayout,
    editingLayout,
    previewLayout,
    inventory,
    loadRoom,
    selectFurniture,
    saveLayout,
    resetEditing,
  };
};

export default useRoom;
