import apiClient from "@/services/apiClient";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface AdoptCharacterResponse {
  characterId: number;
  name: string;
  imgUrl: string;
}

/**
 * 캐릭터 입양
 * POST /characters/adopt
 * 성공 시 새 캐릭터 정보 반환
 */
export async function adoptCharacter(): Promise<AdoptCharacterResponse> {
  const response = await apiClient.post<ApiResponse<AdoptCharacterResponse>>("/characters/adopt");
  return response.data.result;
}
