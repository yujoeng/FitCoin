import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssets } from '../hooks/useAssets';
import ExchangeRateChart from './ExchangeRateChart';
import ExchangeSuccessModal from '@/components/ExchangeSuccessModal';
import PageHeader from '@/components/PageHeader';

export const ExchangePage = () => {
  const router = useRouter();
  const {
    assets,
    exchangeRate,
    rateHistory,
    isLoading,
    errorMessage,
    exchange,
    setErrorMessage,
  } = useAssets();
  const [coinInput, setCoinInput] = useState<string>('');
  const [successCoin, setSuccessCoin] = useState<number | null>(null);

  const calcExpectedPoint = (coinStr: string) => {
    if (!exchangeRate) return 0;
    const coin = parseInt(coinStr, 10);
    if (isNaN(coin)) return 0;
    return coin * exchangeRate.rate;
  };

  const expectedPoint = calcExpectedPoint(coinInput);
  const handleExchange = async () => {
    if (isLoading || !coinInput) return;
    const coin = parseInt(coinInput, 10);
    if (isNaN(coin) || coin <= 0) {
      setErrorMessage('유효한 코인 값을 입력하세요.');
      return;
    }
    // exchange()에 포인트를 넘겨야 하므로 변환
    const point = coin * (exchangeRate?.rate ?? 0);
    const result = await exchange(point);
    if (result) {
      setCoinInput('');
      setSuccessCoin(result.receivedCoin);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setCoinInput(value);
    }
  };

  const chartData = rateHistory.map((item) => ({
    date: new Date(Number(item.timestamp) * 1000)
      .toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
      .replace('. ', '/')
      .replace('.', ''), // "03/25" 형식
    rate: item.rate,
  }));

  return (
    <>
      {/* 1. 상단 헤더 */}
      <PageHeader title='환전소' onBack={() => router.push('/home')} />

      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          padding: '24px 20px 0 20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
        }}
      >
        <ExchangeSuccessModal
          isOpen={successCoin !== null}
          receivedCoin={successCoin ?? 0}
          onClose={() => setSuccessCoin(null)}
        />
        {/* 로딩 딤 처리 */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '4px solid transparent',
                borderTopColor: 'var(--color-primary)',
                animation: 'fc-spin-once 1s linear infinite',
              }}
            />
          </div>
        )}

        {/* 2. 잔액 카드 (카드 형태 제거, 텍스트 형태) */}
        <section style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '16px',
              margin: 0,
              color: 'var(--color-text-primary)',
            }}
          >
            내 자산
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}
              >
                코인
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'var(--color-text-primary)',
                }}
              >
                {assets?.coin || 0}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}
              >
                포인트
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'var(--color-text-primary)',
                }}
              >
                {assets?.point || 0}
              </span>
            </div>
          </div>
        </section>

        {/* 3. 환율 안내 */}
        <section style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
            }}
          >
            포인트 → 코인
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
            }}
          >
            {/* 별조각 아이콘 + 수량 */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img src='/icons/point.svg' alt='별조각' width={18} height={18} />
              <strong>
                {exchangeRate?.rate?.toLocaleString('ko-KR') || '-'}
              </strong>
            </span>

            {/* 화살표 */}
            <span style={{ color: 'var(--color-text-secondary)' }}>→</span>

            {/* 코인 아이콘 + 수량 */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img src='/icons/coin.svg' alt='코인' width={18} height={18} />1
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>최대</span>
            <img src='/icons/coin.svg' alt='코인' width={16} height={16} />
            <span>
              {exchangeRate && assets?.point
                ? Math.floor(assets.point / exchangeRate.rate).toLocaleString(
                    'ko-KR',
                  )
                : 0}
            </span>
            <span>까지 환전 가능</span>
          </div>
        </section>

        {/* 4. 환전 입력 영역 */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'var(--color-text-secondary)',
              }}
            >
              환전할 코인
            </label>
            <input
              type='text'
              value={coinInput}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                !e.nativeEvent.isComposing &&
                !isLoading &&
                handleExchange()
              }
              style={{
                boxSizing: 'border-box',
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                outline: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '16px',
                textAlign: 'left',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
              }}
              placeholder='0'
            />
          </div>
          <div
            style={{
              textAlign: 'left',
              fontSize: '14px',
              marginBottom: '16px',
              color: 'var(--color-text-primary)',
            }}
          >
            = {expectedPoint.toLocaleString('ko-KR')} P
          </div>

          {errorMessage && (
            <p
              style={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </p>
          )}
        </section>

        {/* 5. 환율 그래프 */}
        <section style={{ marginBottom: '96px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '16px',
              margin: 0,
              color: 'var(--color-text-primary)',
            }}
          >
            환율 변동 내역
          </h2>

          {/* 그래프를 감싸는 흰색 카드 영역 */}
          <ExchangeRateChart data={rateHistory} />
        </section>

        {/* 하단 버튼 영역 */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '412px',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          {/* 탭바 등 여백을 고려한 mb-24 위치, 버튼 스타일 */}
          <div
            style={{
              boxSizing: 'border-box',
              padding: '0 20px',
              marginBottom: '96px',
              width: '100%',
            }}
          >
            <button
              onClick={handleExchange}
              disabled={!coinInput || parseInt(coinInput) <= 0}
              style={{
                width: '100%',
                padding: '14px 0',
                backgroundColor:
                  !coinInput || expectedPoint <= 0
                    ? 'var(--color-primary-light)'
                    : 'var(--color-primary)',
                color: 'var(--color-text-inverse)',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                border: 'none',
                cursor:
                  !coinInput || expectedPoint <= 0 ? 'not-allowed' : 'pointer',
                opacity: 1,
              }}
            >
              환전하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
