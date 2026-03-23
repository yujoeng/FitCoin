import React from 'react';
import { Coins } from 'lucide-react';
import { formatCoin } from '@/utils/formatNumber';

interface CoinBadgeProps {
    coins: number;
}

export default function CoinBadge({ coins }: CoinBadgeProps) {
    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
            }}
        >
            <Coins size={18} color="#B8860B" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                    코인
                </span>
                <span
                    className="fc-font-point"
                    style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}
                >
                    {formatCoin(coins)}
                </span>
            </div>
        </div>
    );
}
