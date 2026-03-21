'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import useRoom, { convertLayoutToRoomConfig, toRequestKey } from '@/features/room/hooks/useRoom';
import FurniturePanel from '@/features/room/components/FurniturePanel';
import RoomView from '@/components/RoomView';
import { FurnitureType } from '@/features/room/types/room';

export default function RoomPage() {
  const router = useRouter();
  const {
    isLoading,
    isSaving,
    error,
    editingLayout,
    previewLayout,
    inventory,
    loadRoom,
    selectFurniture,
    saveLayout,
  } = useRoom();

  const [selectedSlot, setSelectedSlot] = useState<FurnitureType>('WALLPAPER');
  const [showToast, setShowToast] = useState(false);

  // 1. 진입 시 데이터 로드
  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  // 저장 처리
  const handleSave = async () => {
    await saveLayout();
    if (!error) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // 현재 선택된 슬롯의 가구 ID 추출
  const currentFurnitureId = editingLayout[toRequestKey(selectedSlot)];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px 8px 4px',
          flexShrink: 0,
          maxWidth: '430px',
          width: '100%',
          margin: '0 auto',
          zIndex: 10,
        }}
      >
        <PageHeader title="방 꾸미기" onBack={() => router.back()} />
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            background: isSaving ? 'var(--color-text-disabled)' : 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            transition: 'opacity 0.2s',
          }}
        >
          {isSaving ? '저장 중' : '저장'}
        </button>
      </div>

      {/* ── 중단: RoomView (미리보기) ── */}
      <div
        style={{
          flex: 1,
          padding: '24px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', height: '100%', maxWidth: '400px', maxHeight: '500px' }}>
          <RoomView
            roomConfig={convertLayoutToRoomConfig(previewLayout)}
            character={null}
            onEditRoom={() => { }}
            hideEditButton={true}
          />
        </div>
      </div>

      {/* ── 하단: FurniturePanel (가구 선택) ── */}
      <div style={{ height: '40vh', flexShrink: 0 }}>
        <FurniturePanel
          inventory={inventory}
          selectedSlot={selectedSlot}
          onSlotChange={setSelectedSlot}
          onSelectFurniture={(id) => selectFurniture(selectedSlot, id)}
          currentFurnitureId={currentFurnitureId}
        />
      </div>

      {/* ── 에러 알림 ── */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-danger)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
          }}
        >
          {error}
        </div>
      )}

      {/* ── 저장 완료 토스트 ── */}
      {showToast && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-md)',
            fontWeight: 700,
            zIndex: 1000,
            animation: 'fc-popIn 0.3s ease-out',
          }}
        >
          저장되었습니다.
        </div>
      )}

      {/* ── 전체 로딩 스피너 ── */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--color-primary-light)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'fc-spin-once 1s linear infinite',
            }}
          />
        </div>
      )}
    </div>
  );
}
