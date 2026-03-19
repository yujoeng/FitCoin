// 테마 탭(아쿠아/머슬/아웃도어/큐트/러닝)을 선택하고 해당 테마 전체 방을 미리보기로 보여주는 컴포넌트

'use client';

import { useState } from 'react';
import RoomView from '@/components/RoomView';
import {
  AQUA_ROOM_CONFIG,
  MUSCLE_ROOM_CONFIG,
  OUTDOOR_ROOM_CONFIG,
  CUTE_ROOM_CONFIG,
  RUNNING_ROOM_CONFIG,
} from '@/data/roomThemes';
import type { UserCharacter } from '@/types/home';
import type { RoomConfig } from '@/types/home';

interface ThemeConfig {
  id: string;
  label: string;
  roomConfig: RoomConfig;
}

const THEMES: ThemeConfig[] = [
  { id: 'aqua', label: '아쿠아', roomConfig: AQUA_ROOM_CONFIG },
  { id: 'muscle', label: '머슬', roomConfig: MUSCLE_ROOM_CONFIG },
  { id: 'outdoor', label: '아웃도어', roomConfig: OUTDOOR_ROOM_CONFIG },
  { id: 'cute', label: '큐트', roomConfig: CUTE_ROOM_CONFIG },
  { id: 'running', label: '러닝', roomConfig: RUNNING_ROOM_CONFIG },
];

interface StoreThemePreviewProps {
  character: UserCharacter | null;
  style?: React.CSSProperties;
}

export default function StoreThemePreview({ character, style }: StoreThemePreviewProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <section style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', flex: 1, ...style }}>
      <h2
        style={{
          color: 'var(--color-text-primary)',
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: '8px',
          paddingLeft: '4px',
        }}
      >
        테마 미리보기
      </h2>

      {/* 탭 바 — 5개 테마, 가로 스크롤 */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #e8e0d0',
          marginBottom: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          /* 스크롤바 숨김은 className으로 처리 */
        }}
        className="fc-hide-scrollbar"
      >
        {THEMES.map((theme, index) => {
          const isActive = selectedTab === index;
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTab(index)}
              style={{
                flexShrink: 0,
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 700 : 400,
                fontSize: '0.9rem',
                cursor: 'pointer',
                borderBottom: isActive
                  ? '2px solid var(--color-primary)'
                  : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {theme.label}
            </button>
          );
        })}
      </div>

      {/* 미리보기 영역 — 선택된 테마의 전체 방 렌더링 */}
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid #e8e0d0',
          position: 'relative',
          flex: 1,
          minHeight: '200px',
        }}
      >
        <RoomView
          key={THEMES[selectedTab].id}
          roomConfig={THEMES[selectedTab].roomConfig}
          character={character}
          onEditRoom={() => { }}
          hideEditButton={true}
        />
      </div>
    </section>
  );
}
