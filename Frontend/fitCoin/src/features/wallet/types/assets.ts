// 보유 자산
export interface Assets {
  point: number;
  coin: number;
}

// 현재 환율
export interface ExchangeRate {
  date: string;
  rate: number;
}

// 환율 히스토리 항목
export interface ExchangeRateHistory {
  timestamp: string;
  rate: number;
}

// 환전 결과
export interface ExchangeResult {
  usedPoint: number;
  receivedCoin: number;
  exchangeRate: number;
}

// 기프티콘
export interface Gifticon {
  gifticonId: number;
  gifticonType: string;
  imageUrl: string;
  issuedAt: string;
}

// 기프티콘 목록 응답
export interface GifticonListResponse {
  gifticons: Gifticon[];
}
