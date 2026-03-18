import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssets } from '../hooks/useAssets';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ExchangePage = () => {
  const router = useRouter();
  const { assets, exchangeRate, rateHistory, isLoading, errorMessage, exchange, setErrorMessage } = useAssets();
  const [pointInput, setPointInput] = useState<string>('');

  const calcExpectedCoin = (pointStr: string) => {
    if (!exchangeRate) return 0;
    const point = parseInt(pointStr, 10);
    if (isNaN(point)) return 0;
    return Math.floor(point / exchangeRate.pointToCoinRate);
  };

  const expectedCoin = calcExpectedCoin(pointInput);

  const handleExchange = async () => {
    if (!pointInput) return;
    const point = parseInt(pointInput, 10);
    if (isNaN(point) || point <= 0) {
      setErrorMessage('유효한 포인트 값을 입력하세요.');
      return;
    }
    const result = await exchange(point);
    if (result) {
      setPointInput('');
      alert(`환전 완료! 코인 ${result.receivedCoin}개를 획득했습니다.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null); // 입력 변경 시 에러 초기화
    const value = e.target.value;
    // 숫자만 허용
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setPointInput(value);
    }
  };

  const chartData = rateHistory.map((item) => ({
    date: item.date.slice(5).replace('-', '/'), // "2026-03-01" → "03/01"
    rate: item.pointToCoinRate,
  }));

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '24px 20px 0 20px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* 로딩 딤 처리 */}
      {isLoading && (
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--color-primary)', animation: 'fc-spin-once 1s linear infinite' }} />
        </div>
      )}

      {/* 1. 상단 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingTop: '8px', paddingBottom: '8px' }}>
        <button 
          onClick={() => router.back()}
          style={{ fontSize: '20px', padding: '0 4px', fontWeight: 'bold', color: 'var(--color-text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>환전소</h1>
      </header>

      {/* 2. 잔액 카드 (카드 형태 제거, 텍스트 형태) */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', margin: 0, color: 'var(--color-text-primary)' }}>내 자산</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>코인</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{assets?.coin || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>포인트</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{assets?.point || 0}</span>
          </div>
        </div>
      </section>

      {/* 3. 환율 안내 */}
      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
        현재 환율 : {exchangeRate?.pointToCoinRate || '-'}P = 1코인
      </div>

      {/* 4. 환전 입력 영역 */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>모바일 환전할 포인트</label>
          <input 
            type="text" 
            value={pointInput}
            onChange={handleInputChange}
            style={{ boxSizing: 'border-box', width: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', outline: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '16px', textAlign: 'left', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
            placeholder="0"
          />
        </div>
        <div style={{ textAlign: 'left', fontSize: '14px', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
          = <span style={{ fontWeight: 600, fontSize: '16px' }}>C</span> {expectedCoin} 코인
        </div>

        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
            {errorMessage}
          </p>
        )}
      </section>

      {/* 5. 환율 그래프 */}
      <section style={{ marginBottom: '96px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', margin: 0, color: 'var(--color-text-primary)' }}>환율 변동 내역</h2>
        
        {/* 그래프를 감싸는 흰색 카드 영역 */}
        <div style={{ boxSizing: 'border-box', width: '100%', height: '224px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary-light)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}P = 1코인`, '환율']}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 하단 버튼 영역 */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '412px', backgroundColor: 'var(--color-bg)' }}>
        {/* 탭바 등 여백을 고려한 mb-24 위치, 버튼 스타일 */}
        <div style={{ boxSizing: 'border-box', padding: '0 20px', marginBottom: '96px', width: '100%' }}>
          <button 
            onClick={handleExchange}
            disabled={!pointInput || expectedCoin <= 0}
            style={{ 
              width: '100%',
              padding: '14px 0',
              backgroundColor: (!pointInput || expectedCoin <= 0) ? 'var(--color-primary-light)' : 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
              border: 'none',
              cursor: (!pointInput || expectedCoin <= 0) ? 'not-allowed' : 'pointer',
              opacity: 1
            }}
          >
            환전하기
          </button>
        </div>
      </div>
    </div>
  );
};
