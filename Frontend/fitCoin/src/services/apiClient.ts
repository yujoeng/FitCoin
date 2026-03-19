import axios from "axios";
import {
  getAccessToken,
  saveAccessToken,
  removeAccessToken,
} from "@/features/auth/utils/tokenUtils";

// Axios 인스턴스
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키(refreshToken) 연동을 위해 필수
});

// 요청 인터셉터: 모든 요청에 Access Token 자동 첨부
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: REISSUE-401 코드일 때만 토큰 재발급 시도
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    // AccessToken 만료(REISSUE-401)이고 재시도한 적 없는 경우에만 reissue
    if (
      error.response?.status === 401 &&
      code === "REISSUE-401" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 무한 루프 방지를 위해 apiClient 대신 기본 axios 사용
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/reissue`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: originalRequest.headers.Authorization,
            },
          },
        );

        const { accessToken } = response.data.result;
        saveAccessToken(accessToken);

        // 새 토큰으로 헤더 교체 후 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (reissueError) {
        // 재발급 실패 시 토큰 초기화 및 로그인 페이지 이동
        removeAccessToken();
        window.location.href = "/login";
        return Promise.reject(reissueError);
      }
    }

    // GLOBAL-401 등 그 외 401은 재발급 없이 바로 로그인으로
    if (error.response?.status === 401) {
      removeAccessToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
