// src/features/auth/utils/tokenUtils.ts
// 인메모리 기반 임시 토큰 관리 유틸리티

let accessToken: string | null = null;

export function saveAccessToken(token: string): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function removeAccessToken(): void {
  accessToken = null;
}

export function hasAccessToken(): boolean {
  return accessToken !== null;
}

// 이 파일이 하는 일: 인증 토큰을 인메모리 변수에 저장, 조회, 삭제, 존재 여부 확인하는 기능을 제공합니다.
