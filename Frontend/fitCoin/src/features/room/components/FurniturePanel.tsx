import React, { useMemo } from 'react';
import { FurnitureItem, FurnitureType } from '../types/room';
import AppImage from '@/shared/components/AppImage';

interface FurniturePanelProps {
  inventory: FurnitureItem[];
  selectedSlot: FurnitureType;
  onSlotChange: (slot: FurnitureType) => void;
  onSelectFurniture: (furnitureId: number | null) => void;
  onClearAll: () => void;
  currentFurnitureId: number | null;
}

const TABS: { label: string; value: FurnitureType }[] = [
  { label: '벽지', value: 'WALLPAPER' },
  { label: '바닥', value: 'FLOOR' },
  { label: '창문', value: 'WINDOW' },
  { label: '아이템1', value: 'LEFT' },
  { label: '아이템2', value: 'RIGHT' },
  { label: '??', value: 'HIDDEN' },
];

export default function FurniturePanel({
  inventory,
  selectedSlot,
  onSlotChange,
  onSelectFurniture,
  onClearAll,
  currentFurnitureId,
}: FurniturePanelProps) {
  // 현재 카테고리에 맞는 아이템 필터링
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => item.furnitureType === selectedSlot);
  }, [inventory, selectedSlot]);

  console.log(inventory);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--color-bg-card)',
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── 카테고리 탭 ── */}
      <div
        className='fc-hide-scrollbar'
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onSlotChange(tab.value)}
            style={{
              padding: '16px 12px',
              fontSize: 'var(--text-sm)',
              fontWeight: selectedSlot === tab.value ? 800 : 500,
              color:
                selectedSlot === tab.value
                  ? 'var(--color-primary)'
                  : 'var(--color-text-secondary)',
              position: 'relative',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
          >
            {tab.label}
            {selectedSlot === tab.value && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '3px',
                  background: 'var(--color-primary)',
                  borderRadius: '10px',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── 가구 목록 그리드 ── */}
      <div
        className='fc-hide-scrollbar'
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px',
        }}
      >
        {/* 배치 해제 버튼 영역 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            onClick={() => onSelectFurniture(null)}
            disabled={currentFurnitureId === null}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg)',
              color:
                currentFurnitureId === null
                  ? 'var(--color-text-disabled)'
                  : 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              border: '2px dashed var(--color-border-strong)',
              opacity: currentFurnitureId === null ? 0.6 : 1,
              cursor: currentFurnitureId === null ? 'default' : 'pointer',
            }}
          >
            {currentFurnitureId === null ? '현재 비어 있음' : '현재 슬롯 해제'}
          </button>

          <button
            onClick={onClearAll}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            전체 해제
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {filteredItems.map((item: FurnitureItem) => {
            const isSelected = currentFurnitureId === item.furnitureId;
            const isOwned = item.owned;

            return (
              <div
                key={item.furnitureId}
                onClick={() => {
                  if (!isOwned) return;
                  // 이미 선택된 아이템이면 해제(null), 아니면 선택
                  onSelectFurniture(isSelected ? null : item.furnitureId);
                }}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: 'var(--radius-xl)',
                  background: isOwned ? 'var(--color-bg-card)' : '#E8E8E8',
                  border: isSelected
                    ? '2px solid var(--color-primary)'
                    : isOwned
                      ? '1.5px solid var(--color-border)'
                      : '1.5px solid #D0D0D0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: isOwned ? 'pointer' : 'default',
                  padding: '10px 6px 6px',
                  gap: '4px',
                  boxShadow: isOwned ? 'var(--shadow-sm)' : 'none',
                  transition: 'transform 0.1s ease',
                }}
                onMouseDown={(e) =>
                  isOwned && (e.currentTarget.style.transform = 'scale(0.96)')
                }
                onMouseUp={(e) =>
                  isOwned && (e.currentTarget.style.transform = 'scale(1)')
                }
                onMouseLeave={(e) =>
                  isOwned && (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                {/* 획득처 뱃지 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background:
                      item.acquireType === 'HIDDEN' ? '#E9D5FF' : '#DBEAFE',
                    color:
                      item.acquireType === 'HIDDEN' ? '#7E22CE' : '#1D4ED8',
                    zIndex: 2,
                  }}
                >
                  {item.acquireType}
                </div>

                {/* 가구 이미지 */}
                <div
                  style={{
                    width: '100%',
                    height: '70%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                >
                  <AppImage
                    src={item.imageUrl}
                    alt={item.furnitureName}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: isOwned ? 'none' : 'brightness(0) opacity(0.2)',
                    }}
                  />
                </div>

                {/* 가구 이름 */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isOwned ? 'var(--color-text-primary)' : '#AAAAAA',
                    textAlign: 'center',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isOwned ? item.furnitureName : '???'}
                </span>

                {/* 미보유 시 오버레이 SVG 아이콘 (옵션) */}
                {!isOwned && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.03)',
                      borderRadius: 'var(--radius-xl)',
                    }}
                  >
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='#AAA'>
                      <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
