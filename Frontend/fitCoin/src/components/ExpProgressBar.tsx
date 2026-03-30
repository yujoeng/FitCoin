import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface ExpProgressBarProps {
  exp: number;
  maxExp: number;
  isGraduatable: boolean;
  onGraduate: () => void;
}

export default function ExpProgressBar({ exp, maxExp, isGraduatable, onGraduate }: ExpProgressBarProps) {

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

          </span>
          { }
        </div>
        {/* 메달 + 10조각 게이지 바 + 트로피 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          {/* 메달 */}
          <Medal size={18} color="var(--color-primary)" />

          {/* 10조각 게이지 바 */}
          <div style={{ flex: 1, display: 'flex', gap: '2px' }}>
            {Array.from({ length: maxExp }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: '3px',
                  background: i < exp
                    ? 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))'
                    : 'var(--color-primary-light)',
                  transition: 'background var(--transition-slow)',
                }}
              />
            ))}
          </div>

          {/* 트로피 */}
          <Trophy
            size={18}
            color={exp >= maxExp ? 'var(--color-primary)' : 'var(--color-text-disabled)'} />
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
