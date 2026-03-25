import React from 'react';
import BaseModal from '@/components/common/BaseModal';
import AppImage from '@/shared/components/AppImage';

interface CharacterGraduateModalProps {
  isOpen: boolean;
  gifticonImageUrl: string | null;
  onConfirm: () => void;
}

export default function CharacterGraduateModal({
  isOpen,
  gifticonImageUrl,
  onConfirm,
}: CharacterGraduateModalProps) {
  return (
    <BaseModal isOpen={isOpen} zIndex={100}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '412px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
          🎉 졸업을 축하해요!
        </h2>
        
        {gifticonImageUrl ? (
          <AppImage
            src={gifticonImageUrl}
            alt="기프티콘 이미지"
            style={{ width: '200px', height: 'auto', borderRadius: '8px', objectFit: 'contain' }}
          />
        ) : (
          <p style={{ color: 'var(--color-text-primary)', textAlign: 'center', padding: '16px 0' }}>
            기프티콘이 지갑에 저장되었어요
          </p>
        )}
        
        <button
          className="fc-btn-primary"
          onClick={onConfirm}
          style={{ width: '100%', marginTop: '8px' }}
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
