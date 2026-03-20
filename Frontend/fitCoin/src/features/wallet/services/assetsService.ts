import apiClient from '@/services/apiClient';
import { Assets, ExchangeRate, ExchangeResult, ExchangeRateHistory, Gifticon, GifticonListResponse } from '../types/assets';

export const assetsService = {
  async getAssets(): Promise<Assets> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return { point: 2947, coin: 0 };
    }
    const response = await apiClient.get('/assets/me');
    // [확인 필요] 백엔드 응답이 { isSuccess, result, ... } 구조인지 명세 확인 필요
    return response.data.result ?? response.data;
  },

  async getExchangeRate(): Promise<ExchangeRate> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return { date: '2026-03-17', pointToCoinRate: 10 };
    }
    const response = await apiClient.get('/assets/exchange-rate');
    // [확인 필요] 단일 객체 리턴인지 result 분리 래핑 구조인지 명세 확인 필요
    return response.data.result ?? response.data;
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
    const response = await apiClient.get('/assets/exchange-rate/history?period=ALL');
    // [확인 필요] 응답 객체 구조 확인 필요
    return response.data.result ?? response.data;
  },

  async exchange(point: number): Promise<ExchangeResult> {
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      return { usedPoint: point, receivedCoin: Math.floor(point / 10), exchangeRate: 10 };
    }
    try {
      const response = await apiClient.post('/assets/exchange', { point });
      // [확인 필요] ExchangeResult가 result 객체 내부에 있는지 단독 리턴인지 확인
      return response.data.result ?? response.data;
    } catch (error: any) {
      const errorData = error.response?.data || {};
      if (errorData.code === 'ASSET4002') throw new Error('보유 포인트가 부족합니다.');
      if (errorData.code === 'ASSET4003') throw new Error('유효하지 않은 포인트 값입니다.');
      if (errorData.code === 'ASSET5001') throw new Error('환율 정보를 조회할 수 없습니다.');
      throw new Error(errorData.message || '환전에 실패했습니다.');
    }
  },

  async getGifticons(): Promise<GifticonListResponse> {
    try {
      const response = await apiClient.get('/wallet');
      return { gifticons: response.data.result };
    } catch (error) {
      throw new Error('기프티콘 목록을 불러오지 못했습니다.');
    }
  }
};
