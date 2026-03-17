import { Assets, ExchangeRate, ExchangeResult, ExchangeRateHistory } from '../types/assets';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const assetsService = {
  async getAssets(): Promise<Assets> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return { point: 2947, coin: 0 };
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch(`${BASE_URL}/assets/me`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) throw new Error('Failed to load assets');
    return response.json();
  },

  async getExchangeRate(): Promise<ExchangeRate> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return { date: '2026-03-17', pointToCoinRate: 10 };
    }
    const response = await fetch(`${BASE_URL}/assets/exchange-rate`);
    if (!response.ok) throw new Error('Failed to load exchange rate');
    return response.json();
  },

  async getExchangeRateHistory(): Promise<{ period: string; exchangeRates: ExchangeRateHistory[] }> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return {
        period: "ALL",
        exchangeRates: [
          { date: "2025-12-01", pointToCoinRate: 10 },
          { date: "2026-01-01", pointToCoinRate: 11 },
          { date: "2026-02-01", pointToCoinRate: 12 },
          { date: "2026-03-01", pointToCoinRate: 10 }
        ]
      };
    }
    const response = await fetch(`${BASE_URL}/assets/exchange-rate/history?period=ALL`);
    if (!response.ok) throw new Error('Failed to load exchange rate history');
    return response.json();
  },

  async exchange(point: number): Promise<ExchangeResult> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return { usedPoint: point, receivedCoin: Math.floor(point / 10), exchangeRate: 10 };
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch(`${BASE_URL}/assets/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ point }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.code === 'ASSET4002') throw new Error('보유 포인트가 부족합니다.');
      if (errorData.code === 'ASSET4003') throw new Error('유효하지 않은 포인트 값입니다.');
      if (errorData.code === 'ASSET5001') throw new Error('환율 정보를 조회할 수 없습니다.');
      throw new Error(errorData.message || '환전에 실패했습니다.');
    }
    return response.json();
  }
};
