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
    return response.data.result ?? response.data;
  },

  async getExchangeRate(): Promise<ExchangeRate> {
    const response = await apiClient.get("/assets/exchange-rate");
    return response.data.result ?? response.data;
  },

  async getExchangeRateHistory(): Promise<{
    exchangeRates: ExchangeRateHistory[];
  }> {
    const response = await apiClient.get("/assets/exchange-rate/history");
    const result = response.data.result;
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

      if (Array.isArray(data)) {
        return { gifticons: data };
      }
      if (data && Array.isArray(data.gifticons)) {
        return { gifticons: data.gifticons };
      }
      return { gifticons: [] };
    } catch (error) {
      throw new Error("기프티콘 목록을 불러오지 못했습니다.");
    }
  },
};

