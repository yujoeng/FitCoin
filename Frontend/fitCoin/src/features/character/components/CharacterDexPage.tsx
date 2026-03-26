// src/features/character/components/CharacterDexPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCharacterDex, CharacterDexApiItem } from '../services/characterApi';
import AppImage from '@/shared/components/AppImage';
import PageHeader from '@/components/PageHeader';

const TOTAL_CHARACTER_COUNT = 17;

type ImageIndex = 0 | 1 | 2;
const IMAGE_LABELS = ['졸업 전', '운동 중', '졸업 후'] as const;

function getImageSrc(item: CharacterDexApiItem, idx: ImageIndex): string {
  return item.imgs[idx];
}

export default function CharacterDexPage() {
  const router = useRouter();
  const [dexData, setDexData] = useState<CharacterDexApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CharacterDexApiItem | null>(
    null,
  );
  const [imageIdx, setImageIdx] = useState<ImageIndex>(0);

  useEffect(() => {
    getCharacterDex()
      .then((data) => {
        setDexData(data);
      })
      .catch((err) => {
        console.error('도감 조회 실패:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const collectedCount = dexData.length;

  function openModal(item: CharacterDexApiItem) {
    setSelectedItem(item);
    setImageIdx(0);
  }

  function closeModal() {
    setSelectedItem(null);
  }

  function prevImage() {
    setImageIdx((prev) => Math.max(0, prev - 1) as ImageIndex);
  }

  function nextImage() {
    setImageIdx((prev) => Math.min(2, prev + 1) as ImageIndex);
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--color-bg, #FFF8E7)',
        maxWidth: '430px',
        margin: '0 auto',
        width: '100%',
        padding: '0 0 var(--space-6, 24px)',
      }}
    >
      {/* ── 헤더 ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-4) var(--space-2)',
        }}
      >
        <PageHeader title='캐릭터 도감' onBack={() => router.push('/home')} />
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
          }}
        >
          {collectedCount} / {TOTAL_CHARACTER_COUNT}
        </span>
      </div>

      {/* ── 3열 그리드 ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-2, 8px)',
          padding: '0 var(--space-3, 12px)',
        }}
      >
        {isLoading ? (
          <div
            style={{
              textAlign: 'center',
              gridColumn: '1 / -1',
              padding: '40px 0',
              color: '#888',
            }}
          >
            불러오는 중...
          </div>
        ) : (
          Array.from({ length: TOTAL_CHARACTER_COUNT }, (_, i) => i + 1).map(
            (id) => {
              const item = dexData.find((d) => d.characterId === id);
              const isCollected = !!item;

              return (
                <div
                  key={id}
                  onClick={() => isCollected && item && openModal(item)}
                  style={{
                    borderRadius: 'var(--radius-xl, 16px)',
                    background: isCollected
                      ? 'var(--color-bg-card, #FFFFFF)'
                      : '#E8E8E8',
                    border: isCollected
                      ? '1.5px solid var(--color-border, #e0e0e0)'
                      : '1.5px solid #D0D0D0',
                    overflow: 'hidden',
                    cursor: isCollected ? 'pointer' : 'default',
                    boxShadow: isCollected
                      ? 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.08))'
                      : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 8px 8px',
                    gap: '6px',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (isCollected)
                      (e.currentTarget as HTMLDivElement).style.transform =
                        'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      'scale(1)';
                  }}
                >
                  {/* 이미지 영역 */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCollected && item ? (
                      <AppImage
                        src={item.imgs[0]}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          filter: 'grayscale(100%)',
                          fontSize: '32px',
                          color: '#AAAAAA',
                          fontWeight: 700,
                        }}
                      >
                        ?
                      </div>
                    )}
                  </div>

                  {/* 이름 */}
                  <span
                    style={{
                      fontSize: 'var(--text-xs, 12px)',
                      fontWeight: 600,
                      color: isCollected
                        ? 'var(--color-text-primary, #1a1a1a)'
                        : '#AAAAAA',
                      textAlign: 'center',
                    }}
                  >
                    {isCollected && item ? item.name : '???'}
                  </span>
                </div>
              );
            },
          )
        )}
      </div>

      {/* ── 상세 모달 (position: absolute, min-height wrapper 안에서) ── */}
      {selectedItem && (
        <div
          onClick={closeModal}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '80px',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-bg-card, #FFFFFF)',
              borderRadius: 'var(--radius-xl, 16px)',
              width: '86%',
              maxWidth: '360px',
              padding: '20px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            {/* 모달 헤더 */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 'var(--text-lg, 18px)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #1a1a1a)',
                  }}
                >
                  {selectedItem.name}
                </span>
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: 'var(--text-xs, 12px)',
                    color: 'var(--color-text-secondary, #888)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  No.{String(selectedItem.characterId).padStart(4, '0')}
                </span>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary, #888)',
                  lineHeight: 1,
                  padding: '4px',
                }}
                aria-label='닫기'
              >
                ✕
              </button>
            </div>

            {/* 이미지 슬라이더 */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              {/* 이전 버튼 */}
              <button
                onClick={prevImage}
                disabled={imageIdx === 0}
                style={{
                  background:
                    imageIdx === 0
                      ? '#E8E8E8'
                      : 'var(--color-primary-light, #EDF4DB)',
                  border: '1px solid var(--color-border, #e0e0e0)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: imageIdx === 0 ? 'default' : 'pointer',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
                aria-label='이전 이미지'
              >
                ‹
              </button>

              {/* 이미지 */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AppImage
                  src={getImageSrc(selectedItem, imageIdx)}
                  alt={`${selectedItem.name} - ${IMAGE_LABELS[imageIdx]}`}
                  style={{
                    width: '140px',
                    height: '140px',
                    objectFit: 'contain',
                  }}
                />
                {/* 레이블 + 인디케이터 */}
                <span
                  style={{
                    fontSize: 'var(--text-xs, 12px)',
                    color: 'var(--color-primary, #96B95B)',
                    fontWeight: 600,
                  }}
                >
                  {IMAGE_LABELS[imageIdx]}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {([0, 1, 2] as ImageIndex[]).map((i) => (
                    <span
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background:
                          i === imageIdx
                            ? 'var(--color-primary, #96B95B)'
                            : 'var(--color-border, #e0e0e0)',
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 다음 버튼 */}
              <button
                onClick={nextImage}
                disabled={imageIdx === 2}
                style={{
                  background:
                    imageIdx === 2
                      ? '#E8E8E8'
                      : 'var(--color-primary-light, #EDF4DB)',
                  border: '1px solid var(--color-border, #e0e0e0)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: imageIdx === 2 ? 'default' : 'pointer',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
                aria-label='다음 이미지'
              >
                ›
              </button>
            </div>

            {/* 설명 */}
            <p
              style={{
                fontSize: 'var(--text-sm, 14px)',
                color: 'var(--color-text-secondary, #666)',
                textAlign: 'center',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: 'var(--font-body)',
              }}
            >
              {selectedItem.description}
            </p>

            {/* 이미지 저장 버튼 */}
            <a
              href={getImageSrc(selectedItem, imageIdx)}
              download={`${selectedItem.name}_${IMAGE_LABELS[imageIdx]}.png`}
              style={{
                display: 'inline-block',
                padding: '10px 28px',
                borderRadius: 'var(--radius-lg, 12px)',
                background: 'var(--color-primary, #96B95B)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 'var(--text-sm, 14px)',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              이미지 저장
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
