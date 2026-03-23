import React, { useState } from 'react';
import { useAssets } from '../hooks/useAssets';
import { Gifticon } from '../types/assets';
import BaseModal from '@/components/common/BaseModal';

const GIFTICON_TYPE_LABEL: Record<string, string> = {
  COFFEE: '커피',
  ICECREAM: '아이스크림',
  // TODO: 백엔드 기프티콘 타입 확정 후 추가
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

export const WalletPage = () => {
  const { gifticons, isLoading } = useAssets();
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null);

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

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '24px 20px 96px 20px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* 로딩 표시 */}
      {isLoading && (
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--color-primary)', animation: 'fc-spin-once 1s linear infinite' }} />
        </div>
      )}

      {/* 헤더 */}
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', margin: '0 0 24px 0' }}>내가 받은 기프티콘</h1>

      {/* 목록 */}
      {!isLoading && (!gifticons || gifticons.length === 0) ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '16px', fontWeight: 'bold' }}>
          보유한 기프티콘이 없습니다
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {gifticons?.map(g => (
            <div 
              key={g.gifticonId} 
              onClick={() => setSelectedGifticon(g)}
              style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ width: '100%', aspectRatio: '1 / 1', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {g.imageUrl ? (
                  <img src={g.imageUrl} alt="gifticon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>이미지 없음</span>
                )}
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{getGifticonLabel(g.gifticonType)}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{formatDate(g.issuedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 모달 */}
      <BaseModal isOpen={!!selectedGifticon} onClose={() => setSelectedGifticon(null)} zIndex={100}>
        {selectedGifticon && (
          <div style={{ margin: '-24px', backgroundColor: '#ffffff', borderRadius: 'inherit', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            <button 
              onClick={() => setSelectedGifticon(null)}
              style={{ position: 'absolute', top: '12px', right: '12px', width: '30px', height: '30px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', zIndex: 10 }}
            >
              ✕
            </button>
            <div style={{ width: '100%', aspectRatio: '1 / 1', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {selectedGifticon.imageUrl ? (
                <img src={selectedGifticon.imageUrl} alt="gifticon detail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>이미지 없음</span>
              )}
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{getGifticonLabel(selectedGifticon.gifticonType)}</span>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>{formatDate(selectedGifticon.issuedAt)}</span>
              <button 
                onClick={() => selectedGifticon.imageUrl && handleDownload(selectedGifticon.imageUrl)}
                disabled={!selectedGifticon.imageUrl}
                style={{ width: '100%', padding: '14px 0', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: selectedGifticon.imageUrl ? 'pointer' : 'not-allowed', opacity: selectedGifticon.imageUrl ? 1 : 0.5 }}
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
