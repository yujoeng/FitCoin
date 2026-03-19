// 상점의 세 가지 뽑기 버튼(포인트 가구 / 코인 가구 / 기프티콘)을 가로로 배치하는 컴포넌트

import React from 'react';
import { Sofa, Armchair, Gift } from 'lucide-react';
import { GachaType, StoreItem } from '@/features/store/types/types';

interface StoreGachaSectionProps {
  onGacha: (type: GachaType) => void;
  isLoading: boolean;
  items: StoreItem[];
}

interface GachaButtonConfig {
  type: GachaType;
  label: string;
  icon: React.ReactNode;
  priceType: 'POINT' | 'COIN';
  itemKeyword: string;
}

const GACHA_BUTTONS: GachaButtonConfig[] = [
  {
    type: 'furniture-point',
    label: '포인트\n가구 뽑기권',
    icon: <Sofa size={32} color="white" />,
    priceType: 'POINT',
    itemKeyword: 'point',
  },
  {
    type: 'furniture-coin',
    label: '코인\n가구 뽑기권',
    icon: <Armchair size={32} color="white" />,
    priceType: 'COIN',
    itemKeyword: 'coin',
  },
  {
    type: 'gifticon',
    label: '기프티콘\n뽑기권',
    icon: <Gift size={32} color="white" />,
    priceType: 'COIN',
    itemKeyword: 'gifticon',
  },
];

export default function StoreGachaSection({
  onGacha,
  isLoading,
  items,
}: StoreGachaSectionProps) {
  const findPrice = (config: GachaButtonConfig): number | null => {
    const match = items.find(
      (item) =>
        item.priceType === config.priceType &&
        item.name.toLowerCase().includes(config.itemKeyword.toLowerCase())
    );
    return match ? match.price : null;
  };

  return (
    <section style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h2
        style={{
          color: 'var(--color-text-primary)',
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: '8px',
          paddingLeft: '2px',
        }}
      >
        뽑기
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {GACHA_BUTTONS.map((config) => {
          const price = findPrice(config);

          return (
            <div
              key={config.type}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                flex: '1 1 0',
                minWidth: '90px',
                maxWidth: '120px',
              }}
            >
              {/* 원형 버튼 */}
              <button
                onClick={() => onGacha(config.type)}
                disabled={isLoading}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '2rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(150, 185, 91, 0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 6px 16px rgba(150, 185, 91, 0.55)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 4px 12px rgba(150, 185, 91, 0.4)';
                }}
                aria-label={`${config.label.replace('\n', ' ')} 뽑기`}
              >
                {config.icon}
              </button>

              {/* 이름 */}
              <span
                style={{
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.4,
                }}
              >
                {config.label}
              </span>

              {/* 가격 */}
              {price !== null && (
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.7rem',
                    textAlign: 'center',
                  }}
                >
                  {price.toLocaleString()}{' '}
                  {config.priceType === 'POINT' ? 'P' : 'C'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
