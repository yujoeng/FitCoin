import apiClient from "@/services/apiClient";
import {
  Assets,
  ExchangeRate,
  ExchangeResult,
  ExchangeRateHistory,
  Gifticon,
  GifticonListResponse,
} from "../types/assets";

export const assetsService = {
  async getAssets(): Promise<Assets> {
    const response = await apiClient.get("/assets/me");
    // [확인 필요] 백엔드 응답이 { isSuccess, result, ... } 구조인지 명세 확인 필요
    return response.data.result ?? response.data;
  },

  async getExchangeRate(): Promise<ExchangeRate> {
    const response = await apiClient.get("/assets/exchange-rate");
    // [확인 필요] 단일 객체 리턴인지 result 분리 래핑 구조인지 명세 확인 필요
    return response.data.result ?? response.data;
  },

  async getExchangeRateHistory(periodType?: string): Promise<{
    exchangeRates: ExchangeRateHistory[];
  }> {
    const endpoint = periodType
      ? `/assets/exchange-rate/history?period=${periodType}`
      : "/assets/exchange-rate/history";
    const response = await apiClient.get(endpoint);
    const result = response.data.result;
    // 배열 직접 내려오는 구조 대응
    const exchangeRates: ExchangeRateHistory[] = Array.isArray(result)
      ? result
      : (result?.exchangeRates ?? []);
    return { exchangeRates };
  },

  async exchange(point: number, rate: number): Promise<ExchangeResult> {
    try {
      const response = await apiClient.post("/assets/exchange", {
        point,
        rate,
      });
      // [확인 필요] ExchangeResult가 result 객체 내부에 있는지 단독 리턴인지 확인
      return response.data.result ?? response.data;
    } catch (error: any) {
      const errorData = error.response?.data || {};
      if (errorData.code === "ASSET4002")
        throw new Error("보유 포인트가 부족합니다.");
      if (errorData.code === "ASSET4003")
        throw new Error("유효하지 않은 포인트 값입니다.");
      if (errorData.code === "ASSET5001")
        throw new Error("환율 정보를 조회할 수 없습니다.");
      throw new Error(errorData.message || "환전에 실패했습니다.");
    }
  },

  async getGifticons(): Promise<GifticonListResponse> {
    try {
      const response = await apiClient.get("/wallet");
      const data = response.data.result ?? response.data;

      // data가 이미 배열인 경우
      if (Array.isArray(data)) {
        return { gifticons: data };
      }

      // data가 { gifticons: [...] } 형태인 경우
      if (data && Array.isArray(data.gifticons)) {
        return { gifticons: data.gifticons };
      }

      // 기본적으로 빈 배열 반환하여 런타임 에러 방지
      return { gifticons: [] };
    } catch (error) {
      throw new Error("기프티콘 목록을 불러오지 못했습니다.");
    }
  },
};
