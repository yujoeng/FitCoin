'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface MissionResultModalProps {
  rewardPoint: number;
  totalPoint: number;
  onConfirm: () => void;
}

export default function MissionResultModal({
  rewardPoint,
  totalPoint,
  onConfirm,
}: MissionResultModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '0 24px',
    }}>
      <div className="fc-card fc-anim-scale" style={{
        width: '100%',
        maxWidth: 360,
        padding: '32px 24px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Check size={28} color="white" strokeWidth={2.5} />
        </div>

        <div style={{
          fontWeight: 900,
          fontSize: '1.3rem',
          color: 'var(--text-1)',
          marginBottom: 4,
        }}>
          미션 완료!
        </div>

        <div style={{
          color: 'var(--text-3)',
          fontSize: '0.85rem',
          marginBottom: 24,
        }}>
          오늘도 잘 했어요 💪
        </div>

        <div style={{
          background: 'var(--surface-2)',
          borderRadius: 12,
          padding: '16px',
          marginBottom: 12,
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-3)',
            marginBottom: 6,
          }}>
            획득 포인트
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--color-primary)',
          }}>
            +{rewardPoint.toLocaleString()} P
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
          marginBottom: 24,
        }}>
          <span style={{ fontSize: '0.83rem', color: 'var(--text-3)' }}>
            누적 포인트
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-1)' }}>
            {totalPoint.toLocaleString()} P
          </span>
        </div>

        <button
          className="fc-btn-primary"
          style={{ width: '100%' }}
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
