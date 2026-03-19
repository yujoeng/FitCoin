import axios from "axios";
import {
  getAccessToken,
  saveAccessToken,
  removeAccessToken,
} from "@/features/auth/utils/tokenUtils";

// ─────────────────────────────────────────────
// 대기열 관련 타입 및 변수
// reissue가 진행 중일 때 들어오는 401 요청들을 대기열에 넣고,
// reissue 완료 후 한꺼번에 재시도하기 위해 사용
// ─────────────────────────────────────────────
interface QueueItem {
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false; // 현재 reissue 진행 중 여부
let failedQueue: QueueItem[] = []; // reissue 완료를 기다리는 요청 목록

/**
 * 대기열 처리 함수
 * - 성공: 새 토큰을 대기 중인 모든 요청에 전달
 * - 실패: 대기 중인 모든 요청에 에러 전달
 */
function processQueue(error: Error | null, token: string | null): void {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token!);
    }
  });
  failedQueue = [];
}

// ─────────────────────────────────────────────
// Axios 인스턴스
// ─────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키(refreshToken) 자동 전송을 위해 필수
});

// ─────────────────────────────────────────────
// 요청 인터셉터: 모든 요청에 Access Token 자동 첨부
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 응답 인터셉터
// ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    // REISSUE-401: AccessToken 만료 → reissue 시도
    if (
      error.response?.status === 401 &&
      code === "REISSUE-401" &&
      !originalRequest._retry
    ) {
      // ── reissue가 이미 진행 중이면 대기열에 추가 ──
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            // reissue 완료 후 새 토큰으로 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // ── reissue 시작 ──
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/reissue`,
          {},
          {
            withCredentials: true, // 쿠키(refreshToken) 자동 전송
            headers: {
              // 백엔드가 만료된 AccessToken도 함께 요구 (명세)
              Authorization: originalRequest.headers.Authorization,
            },
          },
        );

        const { accessToken } = response.data.result;
        saveAccessToken(accessToken);

        // 대기 중인 요청들에 새 토큰 전달 → 일괄 재시도
        processQueue(null, accessToken);

        // 원래 요청도 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (reissueError) {
        // reissue 실패 (refreshToken 만료 등) → 전부 로그인으로
        processQueue(reissueError as Error, null);
        removeAccessToken();
        window.location.href = "/login";
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false; // 성공/실패 관계없이 반드시 초기화
      }
    }

    // GLOBAL-401: 블랙리스트/유효하지 않은 토큰 → 재발급 없이 로그인으로
    if (error.response?.status === 401) {
      removeAccessToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
