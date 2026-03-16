
import apiClient from '@/services/apiClient';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/** 로그인 요청 바디 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 성공 응답
 * accessToken만 내려옴.
 * refreshToken은 서버가 HttpOnly Cookie로 자동 저장하므로 프론트에서 건드릴 필요 없음.
 */
export interface LoginResponse {
  accessToken: string;
}

/** 이메일 인증 코드 발송 요청 바디 */
export interface EmailVerificationRequest {
  email: string;
}

/** 이메일 인증 코드 확인 요청 바디 */
export interface EmailVerificationConfirmRequest {
  email: string;
  code: string;
}

/**
 * 이메일 인증 코드 확인 성공 응답
 * 이 token을 회원가입 요청 바디에 담아서 보내야 함.
 */
export interface EmailVerificationConfirmResponse {
  token: string;
}

/** 회원가입 요청 바디 */
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  exercise_level: 'high' | 'middle' | 'low'; // 백엔드 enum 값 (소문자)
  token: string; // 이메일 인증 완료 후 받은 token
}

/** 비밀번호 재설정 이메일 발송 요청 바디 */
export interface PasswordResetRequestBody {
  email: string;
}

/** 비밀번호 재설정 요청 바디 */
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
 * 실패 → 401 Unauthorized (에러 메시지는 화면에 그대로 출력하지 않도록 주의)
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
}

/**
 * 로그아웃
 * POST /auth/logout
 * 성공/실패 관계없이 로컬 토큰 삭제 처리 (백엔드 명세 기준)
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // 로그아웃은 실패해도 프론트에서는 성공으로 처리 (백엔드 명세)
  }
}

/**
 * 이메일 인증 코드 발송 요청
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
 * 성공 → { token } 반환 — 이 token을 회원가입 시 함께 보내야 함
 */
export async function confirmEmailVerification(
  data: EmailVerificationConfirmRequest,
): Promise<EmailVerificationConfirmResponse> {
  const response = await apiClient.post<EmailVerificationConfirmResponse>(
    '/auth/email-verifications/confirm',
    data,
  );
  return response.data;
}

/**
 * 회원가입
 * POST /auth/signup
 * 성공(201) 후 → 별도로 login() 호출해서 accessToken 받아야 함 (백엔드 명세)
 * 실패 → 400(유효성 오류), 409(이메일 중복)
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
 * POST /auth/password/reset?token=...
 * @param resetToken URL 쿼리 파라미터로 온 식별 토큰
 */
export async function resetPassword(
  resetToken: string,
  data: PasswordResetBody,
): Promise<void> {
  await apiClient.post(`/auth/password/reset?token=${resetToken}`, data);
}
// 이 파일이 하는 일: 서버에 인증 관련 요청을 보내는 함수들을 모아둔다.