import apiClient from '@/services/apiClient';

// ─────────────────────────────────────────────
// 공통 응답 래퍼 타입
// 백엔드 모든 응답이 이 형식으로 감싸져 있음
// ─────────────────────────────────────────────
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ─────────────────────────────────────────────
// 요청/응답 타입 정의
// ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirmRequest {
  email: string;
  code: string;
}

export interface EmailVerificationConfirmResponse {
  token: string;
}

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  exercise_level: 'high' | 'middle' | 'low';
  token: string;
}

export interface PasswordResetRequestBody {
  email: string;
}

export interface PasswordResetBody {
  password: string;
  confirmPassword: string;
}

// ─────────────────────────────────────────────
// API 함수들
// ─────────────────────────────────────────────

/**
 * 로그인
 * POST /auth/login
 * 성공 → { accessToken } 반환
 * 실패 → 401 (에러 메시지 화면에 그대로 출력 금지 — 백엔드 명세)
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data.result; // ← 공통 응답 result에서 꺼냄
}

/**
 * 로그아웃
 * POST /auth/logout
 * 실패해도 성공으로 처리 (백엔드 명세)
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // 로그아웃은 실패해도 프론트에서는 성공으로 처리
  }
}

/**
 * 토큰 재발급
 * POST /auth/reissue
 * 쿠키의 refresh 값은 withCredentials 설정을 통해 자동 전송됨
 */
export async function reissue(): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/reissue');
  return response.data.result;
}

/**
 * 이메일 인증 코드 발송
 * POST /auth/email-verifications
 * 이미 가입된 이메일이면 409 Conflict
 */
export async function requestEmailVerification(
  data: EmailVerificationRequest,
): Promise<void> {
  await apiClient.post('/auth/email-verifications', data);
}

/**
 * 이메일 인증 코드 확인
 * POST /auth/email-verifications/confirm
 * 성공 → { token } 반환 — 회원가입 시 함께 보내야 함
 */
export async function confirmEmailVerification(
  data: EmailVerificationConfirmRequest,
): Promise<EmailVerificationConfirmResponse> {
  const response = await apiClient.post<ApiResponse<EmailVerificationConfirmResponse>>(
    '/auth/email-verifications/confirm',
    data,
  );
  return response.data.result; // ← 공통 응답 result에서 꺼냄
}

/**
 * 회원가입
 * POST /auth/signup
 * 성공(201) 후 → login() 별도 호출해서 accessToken 받아야 함 (백엔드 명세)
 */
export async function signup(data: SignupRequest): Promise<void> {
  await apiClient.post('/auth/signup', data);
}

/**
 * 비밀번호 재설정 이메일 발송
 * POST /auth/password/reset-request
 * 없는 이메일이어도 성공 응답 (백엔드 명세)
 */
export async function requestPasswordReset(
  data: PasswordResetRequestBody,
): Promise<void> {
  await apiClient.post('/auth/password/reset-request', data);
}

/**
 * 비밀번호 재설정
 * PATCH /auth/password/reset?token=...
 */
export async function resetPassword(
  resetToken: string,
  data: PasswordResetBody,
): Promise<void> {
  await apiClient.patch(`/auth/password/reset?token=${resetToken}`, data);
}
// 이 파일이 하는 일: 서버에 인증 관련 요청을 보내는 함수들을 모아둔다.