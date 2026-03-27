// 뽑기 결과(가구 또는 기프티콘)와 에러 메시지를 모달로 표시하는 컴포넌트

import { FurnitureGachaResult, GifticonGachaResult, GachaResult } from '@/features/store/types/types';
import Image from 'next/image';
import BaseModal from '@/components/common/BaseModal';

const GIFTICON_TYPE_LABEL: Record<string, string> = {
  COFFEE: '커피',
  ICECREAM: '아이스크림',
  // TODO: 백엔드 기프티콘 타입 확정 후 추가
};
const getGifticonLabel = (type: string) => GIFTICON_TYPE_LABEL[type] ?? type;

interface GachaResultModalProps {
  isOpen: boolean;
  result: GachaResult | null;
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
  const isCharacter = result !== null && 'character' in result;
  const isGifticon = result !== null && 'acquiredGifticon' in result;

  const itemName = isFurniture
    ? (result as FurnitureGachaResult).acquiredFurniture.furnitureName
    : isGifticon
      ? getGifticonLabel((result as GifticonGachaResult).acquiredGifticon.gifticonType)
      : null;

  const imageUrl = isFurniture
    ? (result as FurnitureGachaResult).acquiredFurniture.imageUrl
    : isGifticon
      ? (result as GifticonGachaResult).acquiredGifticon.imageUrl
      : null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} zIndex={1000}>
      <div
        style={{
          width: '280px',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', width: '100%' }}>
          {error ? (
            /* 에러 상태 */
            <>
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <Image src="/fail.png" alt="fail" fill style={{ objectFit: 'contain' }} />
              </div>
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
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <Image src="/success.png" alt="success" fill style={{ objectFit: 'contain' }} />
              </div>
              <p
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                획득 성공!
              </p>

              {imageUrl && (
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '180px',
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
        </div>

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
