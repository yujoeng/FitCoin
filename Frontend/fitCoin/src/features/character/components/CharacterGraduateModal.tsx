import React from 'react';
import BaseModal from '@/components/common/BaseModal';
import AppImage from '@/shared/components/AppImage';

interface CharacterGraduateModalProps {
  isOpen: boolean;
  gifticonImageUrl: string | null;
  characterImageUrl: string | null;
  onConfirm: () => void;
}

export default function CharacterGraduateModal({
  isOpen,
  gifticonImageUrl,
  characterImageUrl,
  onConfirm,
}: CharacterGraduateModalProps) {
  return (
    <BaseModal isOpen={isOpen} zIndex={100}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '412px' }}>
<<<<<<< Updated upstream
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
          졸업을 축하해요!
        </h2>

        {characterImageUrl && (
          <AppImage
            src={characterImageUrl}
            alt="졸업 캐릭터"
            style={{ width: '120px', height: '120px', objectFit: 'contain' }}
          />
        )}

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

=======
        
        {/* 캐릭터 이미지 */}
        {characterImageUrl && (
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '3px solid var(--color-primary)',
            }}>
              <AppImage
                src={characterImageUrl}
                alt="졸업 캐릭터"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            {/* 졸업 뱃지 */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              fontSize: '28px',
            }}>
              🎓
            </div>
          </div>
        )}

        {/* 타이틀 */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            🎉 졸업을 축하해요!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            열심히 운동한 보상으로 기프티콘을 받았어요
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ width: '100%', height: '1px', background: 'var(--color-border)' }} />

        {/* 기프티콘 */}
        {gifticonImageUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              받은 기프티콘
            </span>
            <div style={{
              background: '#f3f4f6',
              borderRadius: '12px',
              // padding: '12px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <AppImage
                src={gifticonImageUrl}
                alt="기프티콘 이미지"
                style={{ width: '140px', height: '140px', borderRadius: '8px', objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              기프티콘이 지갑에 저장되었어요 🎁
            </span>
          </div>
        ) : (
          <div style={{
            width: '100%',
            padding: '16px',
            background: 'var(--color-primary-light)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              🎁 기프티콘이 지갑에 저장되었어요
            </p>
          </div>
        )}

        {/* 확인 버튼 */}
>>>>>>> Stashed changes
        <button
          className="fc-btn-primary"
          onClick={onConfirm}
          style={{ width: '100%', marginTop: '4px' }}
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}