import apiClient from '@/services/apiClient';

export interface AdAvailabilityResponse {
  adWatchAvailable: boolean;
}

export interface AdStartResponse {
  adUrl: string;
}

/**
 * 광고 시청 가능 여부 조회
 */
export const getAdAvailability = async (): Promise<AdAvailabilityResponse> => {
  const response = await apiClient.get('/ads/availability');
  return response.data.result;
};

/**
 * 광고 시청 시작
 */
export const startAd = async (): Promise<AdStartResponse> => {
  const response = await apiClient.post('/ads/start');
  return response.data.result;
};

/**
 * 광고 시청 완료
 */
export const completeAd = async (): Promise<void> => {
  await apiClient.post('/ads/complete');
};
