import React from 'react';

export interface BaseModalProps {
  isOpen: boolean;           // true일 때만 렌더링
  onClose?: () => void;      // 오버레이 클릭 시 호출 (없으면 클릭해도 닫히지 않음)
  children: React.ReactNode; // 모달 내용
  zIndex?: number;           // 기본값 50, 필요 시 override
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  zIndex = 50,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="fc-animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
