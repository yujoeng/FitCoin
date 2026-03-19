import apiClient from "@/services/apiClient";

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
// 요청/응답 타입 정의 (백엔드 명세 기준)
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
  exercise_level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  token: string;
}

export interface PasswordResetRequestBody {
  email: string;
}

export interface PasswordResetBody {
  password: string;
  confirmPassword: string;
  token: string;
}

// ─────────────────────────────────────────────
// API 함수들
// ─────────────────────────────────────────────

/**
 * 로그인 - 성공 시 ApiResponse의 result(accessToken) 반환
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  // 제네릭에 ApiResponse<LoginResponse>를 입혀줘야 함
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data,
  );
  return response.data.result; // data가 아니라 data.result를 반환
}

/**
 * 로그아웃 - 실패해도 성공으로 처리
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    // 로그아웃 실패 무시
  }
}

/**
 * 토큰 재발급
 */
export async function reissue(): Promise<LoginResponse> {
  const response =
    await apiClient.post<ApiResponse<LoginResponse>>("/auth/reissue");
  return response.data.result;
}

/**
 * 이메일 인증 코드 발송
 */
export async function requestEmailVerification(
  data: EmailVerificationRequest,
): Promise<void> {
  // 결과값이 없는 경우 ApiResponse<unknown> 등으로 처리하거나 생략 가능
  await apiClient.post("/auth/email-verifications", data);
}

/**
 * 이메일 인증 코드 확인 - { token } 반환
 */
export async function confirmEmailVerification(
  data: EmailVerificationConfirmRequest,
): Promise<EmailVerificationConfirmResponse> {
  const response = await apiClient.post<
    ApiResponse<EmailVerificationConfirmResponse>
  >("/auth/email-verifications/confirm", data);
  return response.data.result;
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<void> {
  await apiClient.post("/auth/signup", data);
}

/**
 * 비밀번호 재설정 이메일 발송
 */
export async function requestPasswordReset(
  data: PasswordResetRequestBody,
): Promise<void> {
  await apiClient.post("/auth/password/reset-request", data);
}

/**
 * 비밀번호 재설정
 */
export async function resetPassword(data: PasswordResetBody): Promise<void> {
  await apiClient.post("/auth/password/reset", data);
}
