import apiClient from "@/services/apiClient";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface WalletGifticon {
  gifticonId: number;
  gifticonType: string;
  imageUrl: string;
  issuedAt: string;
}

export async function getWallet(): Promise<ApiResponse<{ gifticons: WalletGifticon[] }>> {
  const response = await apiClient.get<ApiResponse<{ gifticons: WalletGifticon[] }>>("/wallet");
  return response.data;
}
