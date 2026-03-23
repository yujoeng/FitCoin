/**
 * 포인트 숫자를 "3,500P" 형태로 변환
 */
export function formatPoint(value: number): string {
    return `${value.toLocaleString()}P`;
}

/**
 * 코인 숫자를 "1.5C" 형태로 변환
 */
export function formatCoin(value: number): string {
    return `${value.toLocaleString()}C`;
}