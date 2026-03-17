// 보유 자산
export interface Assets {
  point: number;
  coin: number;
}

// 현재 환율
export interface ExchangeRate {
  date: string;
  pointToCoinRate: number;
}

// 환율 히스토리 항목
export interface ExchangeRateHistory {
  date: string;
  pointToCoinRate: number;
}

// 환전 결과
export interface ExchangeResult {
  usedPoint: number;
  receivedCoin: number;
  exchangeRate: number;
}
