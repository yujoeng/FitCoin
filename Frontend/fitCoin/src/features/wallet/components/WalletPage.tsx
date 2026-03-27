import React, { useState, useMemo } from 'react';
import { useAssets } from '../hooks/useAssets';
import { useRouter } from 'next/navigation';
import { Gifticon } from '../types/assets';
import AppImage from '@/shared/components/AppImage';
import BaseModal from '@/components/common/BaseModal';
import PageHeader from '@/components/PageHeader';

const GIFTICON_TYPE_LABEL: Record<string, string> = {
  COFFEE: '커피',
  ICECREAM: '아이스크림',
  CHICKEN: '치킨',
};
const getGifticonLabel = (type: string) => GIFTICON_TYPE_LABEL[type] ?? type;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

type SortKey = 'latest' | 'oldest' | 'type';

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
];

export const WalletPage = () => {
  const router = useRouter();
  const { gifticons, isLoading } = useAssets();
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(
    null,
  );
  const [sortKey, setSortKey] = useState<SortKey>('latest');

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `gifticon_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const hasGifticons =
    !isLoading && Array.isArray(gifticons) && gifticons.length > 0;

  const sortedGifticons = useMemo(() => {
    if (!Array.isArray(gifticons)) return [];
    const arr = [...gifticons];
    if (sortKey === 'latest')
      return arr.sort(
        (a, b) =>
          new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
      );
    if (sortKey === 'oldest')
      return arr.sort(
        (a, b) =>
          new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime(),
      );
    if (sortKey === 'type')
      return arr.sort((a, b) =>
        getGifticonLabel(a.gifticonType).localeCompare(
          getGifticonLabel(b.gifticonType),
        ),
      );
    return arr;
  }, [gifticons, sortKey]);

  return (
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
        overflow: 'hidden',
        padding: 'var(--space-4)',
      }}
    >
      {/* 로딩 표시 */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '4px solid transparent',
              borderTopColor: 'var(--color-primary)',
              animation: 'fc-spin-once 1s linear infinite',
            }}
          />
        </div>
      )}

      {/* 헤더 */}
      <PageHeader
        title='내가 받은 기프티콘'
        onBack={() => router.push('/home')}
      />

      {/* 고정 상단 영역 */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: 'var(--space-3)',
          marginTop: 'var(--space-4)',
          borderRadius: '16px',
        }}
      >
        {/* 요약 + 정렬 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}
        >
          {/* 총 보유 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🎁</span>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                }}
              >
                보유 중인 기프티콘
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)',
                  lineHeight: 1.2,
                }}
              >
                {hasGifticons ? (gifticons as Gifticon[]).length : 0}장
              </div>
            </div>
          </div>

          {/* 정렬 선택 */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortKey(opt.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: sortKey === opt.value ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor:
                    sortKey === opt.value
                      ? 'var(--color-primary)'
                      : 'var(--color-primary-light)',
                  color:
                    sortKey === opt.value
                      ? '#ffffff'
                      : 'var(--color-text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 스크롤 목록 */}
      <div
        className='fc-hide-scrollbar'
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-3) 0',
        }}
      >
        {!isLoading &&
        (!gifticons || !Array.isArray(gifticons) || gifticons.length === 0) ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            보유한 기프티콘이 없습니다
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
            }}
          >
            {sortedGifticons.map((g) => (
              <div
                key={g.gifticonId}
                onClick={() => setSelectedGifticon(g)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {g.imageUrl ? (
                    <AppImage
                      src={g.imageUrl}
                      alt='gifticon'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '12px',
                      }}
                    >
                      이미지 없음
                    </span>
                  )}
                </div>
                <div
                  style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {getGifticonLabel(g.gifticonType)}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {formatDate(g.issuedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 모달 */}
      <BaseModal
        isOpen={!!selectedGifticon}
        onClose={() => setSelectedGifticon(null)}
        zIndex={100}
      >
        {selectedGifticon && (
          <div
            style={{
              margin: '-24px',
              backgroundColor: '#ffffff',
              borderRadius: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedGifticon(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '16px',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <div
              style={{
                width: '100%',
                maxHeight: '260px',
                aspectRatio: '1 / 1',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {selectedGifticon.imageUrl ? (
                <AppImage
                  src={selectedGifticon.imageUrl}
                  alt='gifticon detail'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '14px',
                  }}
                >
                  이미지 없음
                </span>
              )}
            </div>
            <div
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'var(--color-text-primary)',
                }}
              >
                {getGifticonLabel(selectedGifticon.gifticonType)}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '16px',
                }}
              >
                {formatDate(selectedGifticon.issuedAt)}
              </span>
              <button
                onClick={() =>
                  selectedGifticon.imageUrl &&
                  handleDownload(selectedGifticon.imageUrl)
                }
                disabled={!selectedGifticon.imageUrl}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: 'none',
                  cursor: selectedGifticon.imageUrl ? 'pointer' : 'not-allowed',
                  opacity: selectedGifticon.imageUrl ? 1 : 0.5,
                }}
              >
                이미지 저장
              </button>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
};
