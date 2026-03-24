import React from 'react';

interface ExpProgressBarProps {
  exp: number;
  maxExp: number;
  isGraduatable: boolean;
  onGraduate: () => void;
}

export default function ExpProgressBar({ exp, maxExp, isGraduatable, onGraduate }: ExpProgressBarProps) {
  const expPercent = maxExp > 0 ? (exp / maxExp) * 100 : 0;

  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        background: 'var(--color-bg-card)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-5)',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
          Lv.
        </span>
        <span
          className="fc-font-point"
          style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: '#fff', lineHeight: 1 }}
        >
          {exp}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-1)',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
            경험치
          </span>
          {/* 하드코딩된 숫자 (0/10) 제거됨 */}
        </div>
        <div
          style={{
            height: '10px',
            width: '100%',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-light)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${expPercent}%`,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))',
              transition: 'width var(--transition-slow)',
            }}
          />
        </div>
        {isGraduatable && (
          <button
            className="fc-btn-primary"
            onClick={onGraduate}
            style={{ width: '100%', marginTop: '12px' }}
          >
            졸업하기
          </button>
        )}
      </div>
    </div>
  );
}
