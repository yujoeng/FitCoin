import React from 'react';
import { TrendingUp } from 'lucide-react';

interface PointBadgeProps {
    points: number;
}

export default function PointBadge({ points }: PointBadgeProps) {
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
            <TrendingUp size={18} color="var(--color-primary)" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                    포인트
                </span>
                <span
                    className="fc-font-point"
                    style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}
                >
                    {points.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
