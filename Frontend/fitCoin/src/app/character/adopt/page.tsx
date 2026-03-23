'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adoptCharacter, AdoptCharacterResponse } from '@/features/character/services/characterApi';

export default function CharacterAdoptPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<AdoptCharacterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdopt = async () => {
      try {
        const data = await adoptCharacter();
        setCharacter(data);
      } catch (err: any) {
        console.error('캐릭터 입양 실패:', err);
        setError('이미 캐릭터를 보유하고 있습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdopt();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden',
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 24px 40px',
      overflow: 'hidden',
    }}>
      <style>
        {`
          @keyframes swing {
            0% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
            100% { transform: rotate(-10deg); }
          }
          .animate-swing {
            animation: swing 0.6s infinite ease-in-out;
            transform-origin: bottom center;
          }
        `}
      </style>

      {/* 헤더 안내 영역 */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--color-text-primary)'
        }}>
          새로운 친구가 찾아왔어요!
        </h1>
      </div>

      {/* 캐릭터 표출 영역 */}
      {character ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <div className="animate-swing" style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {character.imgUrl ? (
              <img
                src={character.imgUrl}
                alt={character.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>이미지 로딩 실패</span>
            )}
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--color-primary)'
          }}>
            {character.name}
          </h2>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <p style={{ color: 'red', fontWeight: 600, textAlign: 'center' }}>{error || '캐릭터 정보를 불러올 수 없습니다.'}</p>
        </div>
      )}

      {/* 버튼 영역 */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 캐릭터 변경권 (툴팁 포함) */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            position: 'absolute',
            top: '-34px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 500,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}>
            준비 중
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid rgba(0,0,0,0.75)'
            }} />
          </div>
          <button
            disabled
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--color-bg-card)',
              color: '#A0A0A0', // disabled text
              fontWeight: 600,
              fontSize: '16px',
              border: '2px solid rgba(0,0,0,0.05)',
              cursor: 'not-allowed',
            }}
          >
            캐릭터 변경권 사용
          </button>
        </div>

        {/* 확인 버튼 */}
        <button
          className="fc-btn-primary"
          onClick={() => router.push('/home')}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-xl)',
            fontSize: '18px',
            border: 'none',
            fontWeight: 700,
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}
