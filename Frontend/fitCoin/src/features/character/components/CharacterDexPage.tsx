// src/features/character/components/CharacterDexPage.tsx
'use client';

import { useState } from 'react';
import { CHARACTER_DEX_DATA, TOTAL_CHARACTER_COUNT } from '../data/characterDex';
import type { CharacterDexItem } from '../types/character';

type ImageIndex = 0 | 1 | 2;
const IMAGE_LABELS = ['졸업 전', '운동 중', '졸업 후'] as const;

function getImageSrc(item: CharacterDexItem, idx: ImageIndex): string {
  if (idx === 0) return item.images.before;
  if (idx === 1) return item.images.exercise;
  return item.images.after;
}

export default function CharacterDexPage() {
  const [selectedItem, setSelectedItem] = useState<CharacterDexItem | null>(null);
  const [imageIdx, setImageIdx] = useState<ImageIndex>(0);

  const collectedCount = CHARACTER_DEX_DATA.filter((c) => c.collected).length;

  function openModal(item: CharacterDexItem) {
    setSelectedItem(item);
    setImageIdx(0);
  }

  function closeModal() {
    setSelectedItem(null);
  }

  function prevImage() {
    setImageIdx((prev) => (Math.max(0, prev - 1) as ImageIndex));
  }

  function nextImage() {
    setImageIdx((prev) => (Math.min(2, prev + 1) as ImageIndex));
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
          padding: 'var(--space-4, 16px) var(--space-4, 16px) var(--space-2, 8px)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-xl, 20px)',
            fontWeight: 700,
            color: 'var(--color-text-primary, #1a1a1a)',
            margin: 0,
          }}
        >
          캐릭터 도감
        </h1>
        <span
          style={{
            fontSize: 'var(--text-sm, 14px)',
            fontWeight: 600,
            color: 'var(--color-primary, #96B95B)',
            background: 'var(--color-primary-light, #EDF4DB)',
            borderRadius: 'var(--radius-full, 9999px)',
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
        {CHARACTER_DEX_DATA.map((item) => (
          <div
            key={item.id}
            onClick={() => item.collected && openModal(item)}
            style={{
              borderRadius: 'var(--radius-xl, 16px)',
              background: item.collected ? 'var(--color-bg-card, #FFFFFF)' : '#E8E8E8',
              border: item.collected
                ? '1.5px solid var(--color-border, #e0e0e0)'
                : '1.5px solid #D0D0D0',
              overflow: 'hidden',
              cursor: item.collected ? 'pointer' : 'default',
              boxShadow: item.collected ? 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.08))' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 8px 8px',
              gap: '6px',
              transition: 'transform 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (item.collected) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
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
              {item.collected ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.images.before}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
                color: item.collected
                  ? 'var(--color-text-primary, #1a1a1a)'
                  : '#AAAAAA',
                textAlign: 'center',
              }}
            >
              {item.collected ? item.name : '???'}
            </span>
          </div>
        ))}
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
                  No.{String(selectedItem.id).padStart(4, '0')}
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
                aria-label="닫기"
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
                  background: imageIdx === 0 ? '#E8E8E8' : 'var(--color-primary-light, #EDF4DB)',
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
                aria-label="이전 이미지"
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
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
                  background: imageIdx === 2 ? '#E8E8E8' : 'var(--color-primary-light, #EDF4DB)',
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
                aria-label="다음 이미지"
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
