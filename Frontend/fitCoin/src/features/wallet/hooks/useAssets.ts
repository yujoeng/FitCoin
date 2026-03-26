import { useState, useEffect } from "react";
import {
  Assets,
  ExchangeRate,
  ExchangeResult,
  ExchangeRateHistory,
  Gifticon,
  GifticonListResponse,
} from "../types/assets";
import { assetsService } from "../services/assetsService";

export const useAssets = () => {
  const [assets, setAssets] = useState<Assets | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [rateHistory, setRateHistory] = useState<ExchangeRateHistory[]>([]);
  const [gifticons, setGifticons] = useState<Gifticon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [assetsData, rateData, historyData, gifticonData] =
        await Promise.all([
          assetsService.getAssets(),
          assetsService.getExchangeRate(),
          assetsService.getExchangeRateHistory(),
          assetsService.getGifticons(),
        ]);
      setAssets(assetsData);
      setExchangeRate(rateData);
      setRateHistory(historyData.exchangeRates);
      setGifticons(gifticonData.gifticons);
    } catch (error: any) {
      setErrorMessage(
        error.message || "데이터를 불러오는 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exchange = async (point: number): Promise<ExchangeResult | null> => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      if (!exchangeRate) {
        setErrorMessage("환율 정보를 불러오지 못했습니다.");
        return null;
      }
      const result = await assetsService.exchange(point, exchangeRate.rate);
      // 환전 후 잔액 다시 조회
      const newAssets = await assetsService.getAssets();
      setAssets(newAssets);
      return result;
    } catch (error: any) {
      setErrorMessage(error.message || "환전에 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assets,
    exchangeRate,
    rateHistory,
    gifticons,
    isLoading,
    errorMessage,
    exchange,
    setErrorMessage,
    fetchData,
  };
};
