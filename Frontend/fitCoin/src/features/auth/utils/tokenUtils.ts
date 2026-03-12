// src/features/auth/utils/tokenUtils.ts
// 로컬 스토리지 기반 임시 토큰 관리 유틸리티

const TOKEN_KEY = 'fitcoin_access_token';

export function saveAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

export function getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

export function removeAccessToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function hasAccessToken(): boolean {
    return getAccessToken() !== null;
}

// TODO: 추후 Secure Storage로 교체 예정
// 이 파일이 하는 일: 인증 토큰을 로컬 스토리지에 저장, 조회, 삭제, 존재 여부 확인하는 기능을 제공합니다.
