export function saveAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

export function removeAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}

// 이 파일이 하는 일: 인증 토큰을 인메모리 변수에 저장, 조회, 삭제, 존재 여부 확인하는 기능을 제공합니다.
