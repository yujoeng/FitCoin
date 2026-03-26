import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssets } from '../hooks/useAssets';
import ExchangeRateChart from './ExchangeRateChart';
import ExchangeSuccessModal from '@/components/ExchangeSuccessModal';
import PageHeader from '@/components/PageHeader';
import PointBadge from '@/components/PointBadge';
import CoinBadge from '@/components/CoinBadge';

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

  useEffect(() => {
    const shell = document.querySelector('.fc-app-shell') as HTMLElement;
    if (shell) shell.style.overflowY = 'hidden';
    return () => {
      if (shell) shell.style.overflowY = 'auto';
    };
  }, []);

  return (
    <>
      <PageHeader title='환전소' onBack={() => router.push('/home')} />

      <div
        style={{
          position: 'relative',
          height: 'calc(100dvh - 56px - 64px - var(--safe-bottom))',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          overflow: 'hidden',
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

        {/* 2+3. 잔액 뱃지 + 환율 안내 */}
        <section
          style={{
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          {/* 환율 안내 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
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
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <img
                  src='/icons/point.svg'
                  alt='별조각'
                  width={18}
                  height={18}
                />
                <strong>
                  {exchangeRate?.rate?.toLocaleString('ko-KR') || '-'}
                </strong>
              </span>
              <span>→</span>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
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
          </div>

          {/* 잔액 뱃지 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            <PointBadge points={assets?.point ?? 0} />
            <CoinBadge coins={assets?.coin ?? 0} />
          </div>
        </section>

        {/* 4. 환전 입력 영역 */}
        <section style={{ marginBottom: '16px', flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: 'white',
              border: 'solid 0.5px lightgrey',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <img src='/icons/coin.svg' alt='코인' width={24} height={24} />
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
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  width: '100%',
                }}
                placeholder='0'
              />
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'row',
                gap: '4px',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              ={' '}
              <img
                src='/icons/point.svg'
                alt='포인트'
                width={16}
                height={16}
                style={{ verticalAlign: 'middle', marginRight: '2px' }}
              />
              {expectedPoint.toLocaleString('ko-KR')}
            </div>
          </div>

          <button
            onClick={handleExchange}
            disabled={!coinInput || parseInt(coinInput) <= 0}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: expectedPoint > 0 ? '#96b95b' : '#f3f4f6',
                border: 'solid 0.5px lightgrey',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color:
                  expectedPoint > 0 ? '#ffffff' : 'var(--color-text-secondary)',
                cursor: expectedPoint > 0 ? 'pointer' : 'default',
              }}
            >
              <img src='/icons/point.svg' alt='포인트' width={14} height={14} />
              {expectedPoint.toLocaleString('ko-KR')} - 환전하기
            </div>
          </button>

          {errorMessage && (
            <p
              style={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 600,
                marginTop: '12px',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </p>
          )}
        </section>

        {/* 5. 환율 그래프 — 남은 공간 전부 차지 */}
        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 0 12px 0',
              color: 'var(--color-text-primary)',
              flexShrink: 0,
            }}
          >
            환율 변동 내역
          </h2>
          <div style={{ flex: 1, minHeight: 0, height: '100%' }}>
            <ExchangeRateChart data={rateHistory} />
          </div>
        </section>
      </div>
    </>
  );
};
