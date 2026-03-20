import axios from 'axios';
import { getAccessToken, saveAccessToken, removeAccessToken } from '@/features/auth/utils/tokenUtils';

// ─────────────────────────────────────────────
// API Base URL 설정
// 1. NEXT_PUBLIC_API_BASE_URL 가 있으면 우선 사용 (뒤에 /api 붙임)
// 2. NEXT_PUBLIC_API_URL 이 있으면 사용 (기존 호환성)
// 3. 둘 다 없으면 현재 접속 도메인 기준 /api 사용 (배포 환경 대응)
// ─────────────────────────────────────────────
const getBaseURL = () => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return base.endsWith('/api') ? base : `${base}/api`;
  }
  // 배포 환경(브라우저)에서 설정이 없으면 현재 도메인 사용
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  return 'http://localhost:8080/api';
};

// Axios 인스턴스
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키(refreshToken) 연동을 위해 필수
});

// ─────────────────────────────────────────────
// 동시 reissue 방지용 모듈 레벨 변수
// _retry는 요청별 객체라 공유 안 됨 → 반드시 모듈 레벨로 선언해야 함
// ─────────────────────────────────────────────
let isRefreshing = false;
type QueueItem = { resolve: (token: string) => void; reject: (err: unknown) => void };
const failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as string);
  });
  failedQueue.length = 0;
}

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
      code === 'REISSUE-401' &&
      !originalRequest._retry
    ) {
      // ── reissue가 이미 진행 중이면 대기열에 추가 ──
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
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
      isRefreshing = true; // 동기적으로 설정 → 다음 요청이 여기서 막힘

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
        processQueue(reissueError, null);
        removeAccessToken();
        window.location.href = '/login';
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false; // 성공/실패 관계없이 반드시 초기화
      }
    }

    // GLOBAL-401: 블랙리스트/유효하지 않은 토큰 → 재발급 없이 로그인으로
    if (error.response?.status === 401) {
      removeAccessToken();
      window.location.href = '/login';
    }

    // 403: 백엔드 AuthenticationEntryPoint 미설정 시 Spring Security가 반환하는 403
    // 정상적으로는 401이 와야 하나, 백엔드 수정 전까지 동일하게 처리
    if (error.response?.status === 403) {
      removeAccessToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default apiClient;
