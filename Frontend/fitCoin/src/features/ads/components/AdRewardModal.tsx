'use client';

import React from 'react';
import BaseModal from '@/components/common/BaseModal';

interface AdRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdRewardModal: React.FC<AdRewardModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen}>
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
          포인트 획득!
        </h3>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}
        >
          광고 시청을 완료했습니다.<br />
          보너스 포인트가 지급되었습니다!
        </p>
        <button
          onClick={onClose}
          className="fc-pressable"
          style={{
            width: '100%',
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
          확인
        </button>
      </div>
    </BaseModal>
  );
};

export default AdRewardModal;
