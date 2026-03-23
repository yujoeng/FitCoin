// 뽑기 결과(가구 또는 기프티콘)와 에러 메시지를 모달로 표시하는 컴포넌트

import { Sparkles, AlertCircle } from 'lucide-react';
import { FurnitureGachaResult, GifticonGachaResult } from '@/features/store/types/types';
import Image from 'next/image';
import BaseModal from '@/components/common/BaseModal';

interface GachaResultModalProps {
  isOpen: boolean;
  result: FurnitureGachaResult | GifticonGachaResult | null;
  error: string | null;
  onClose: () => void;
}

export default function GachaResultModal({
  isOpen,
  result,
  error,
  onClose,
}: GachaResultModalProps) {
  if (!isOpen) return null;

  const isFurniture = result !== null && 'acquiredFurniture' in result;
  const itemName = isFurniture
    ? (result as FurnitureGachaResult).acquiredFurniture.furnitureName
    : result !== null
    ? (result as GifticonGachaResult).gifticon.gifticonName
    : null;
  const imageUrl = isFurniture
    ? (result as FurnitureGachaResult).acquiredFurniture.imageUrl
    : result !== null
    ? (result as GifticonGachaResult).gifticon.imageUrl
    : null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} zIndex={1000}>
      <div
        style={{
          maxWidth: '320px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {error ? (
          /* 에러 상태 */
          <>
            <AlertCircle size={48} color="#ef4444" />
            <p
              style={{
                color: '#e53e3e',
                fontWeight: 600,
                fontSize: '1rem',
                textAlign: 'center',
              }}
            >
              뽑기 실패
            </p>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          </>
        ) : result ? (
          /* 결과 상태 */
          <>
            <Sparkles size={48} color="var(--color-primary)" />
            <p
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              획득!
            </p>

            {imageUrl && (
              <div
                style={{
                  position: 'relative',
                  width: '140px',
                  height: '140px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-bg)',
                }}
              >
                <Image
                  src={imageUrl}
                  alt={itemName ?? '획득 아이템'}
                  fill
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.src = "/icons/error.png";
                  }}
                />
              </div>
            )}

            {itemName && (
              <p
                style={{
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textAlign: 'center',
                }}
              >
                {itemName}
              </p>
            )}
          </>
        ) : (
          /* 로딩 중 (isOpen이지만 result,error 모두 null인 경우) */
          <p style={{ color: 'var(--color-text-secondary)' }}>뽑기 중...</p>
        )}

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '12px 0',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
