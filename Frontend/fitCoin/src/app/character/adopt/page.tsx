'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adoptCharacter, AdoptCharacterResponse } from '@/features/character/services/characterApi';
import { rerollCharacter } from '@/features/store/services/storeApi';

export default function CharacterAdoptPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<AdoptCharacterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingCoin, setRemainingCoin] = useState<number | null>(null);

  const handleAdopt = async () => {
    if (isLoading) return;
    setIsLoading(true);
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

  const handleReroll = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await rerollCharacter();
      if (data.isSuccess && data.result) {
        setCharacter({
          characterId: data.result.character.characterId,
          name: data.result.character.characterName,
          imgUrl: data.result.character.imageUrl,
        });
        setRemainingCoin(data.result.remainingCoin);
      } else {
        setError('다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error('캐릭터 리롤 실패:', err);
      const code = err?.response?.data?.code;
      if (code === 'US4002') {
        setError('코인이 부족합니다.');
      } else if (code === 'CHARACTER-404') {
        setError('현재 키우고 있는 캐릭터가 없습니다.');
      } else {
        setError('다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      ) : error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <p style={{ color: 'red', fontWeight: 600, textAlign: 'center' }}>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px 0' }}>
          <button
            className="fc-btn-primary"
            onClick={handleAdopt}
            disabled={isLoading}
            style={{ width: 'auto', padding: '12px 32px', borderRadius: 'var(--radius-xl)', fontSize: '18px', border: 'none', fontWeight: 700 }}
          >
            입양하기
          </button>
        </div>
      )}

      {/* 버튼 영역 */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {error && character && (
          <p style={{ color: 'red', fontWeight: 600, textAlign: 'center', marginBottom: '-8px' }}>
            {error}
          </p>
        )}

        {remainingCoin !== null && (
          <p style={{ textAlign: 'center', color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px', marginBottom: '-8px' }}>
            보유 코인: {remainingCoin}
          </p>
        )}

        {/* 캐릭터 변경권 (리롤) */}
        <button
          onClick={handleReroll}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            fontWeight: 700,
            fontSize: '16px',
            border: '2px solid var(--color-primary)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          캐릭터 변경하기
        </button>

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
