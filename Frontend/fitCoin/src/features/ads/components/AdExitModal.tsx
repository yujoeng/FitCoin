'use client';

import React from 'react';
import BaseModal from '@/components/common/BaseModal';

interface AdExitModalProps {
  isOpen: boolean;
  onExitConfirm: () => void;
  onExitCancel: () => void;
}

const AdExitModal: React.FC<AdExitModalProps> = ({ isOpen, onExitConfirm, onExitCancel }) => {
  return (
    <BaseModal isOpen={isOpen} zIndex={200}>
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginTop: '8px',
            marginBottom: '8px',
          }}
        >
          광고를 그만 볼까요?
        </h3>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}
        >
          지금 나가면 포인트를 받을 수 없어요.<br />
          끝까지 시청하고 혜택을 받아보세요!
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onExitConfirm}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            나가기
          </button>
          <button
            onClick={onExitCancel}
            className="fc-pressable"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            계속 볼게요
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default AdExitModal;
