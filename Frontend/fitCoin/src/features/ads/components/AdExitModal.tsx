'use client';

import React from 'react';

interface AdExitModalProps {
  isOpen: boolean;
  onExitConfirm: () => void;
  onExitCancel: () => void;
}

const AdExitModal: React.FC<AdExitModalProps> = ({ isOpen, onExitConfirm, onExitCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200, // AdPlayer(100)보다 높게
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
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
    </div>
  );
};

export default AdExitModal;
