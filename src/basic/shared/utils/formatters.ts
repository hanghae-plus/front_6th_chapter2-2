/**
 * 가격을 한국 원화 형식으로 포맷
 * @param price - 포맷할 가격 (숫자)
 * @returns 포맷된 가격 문자열 (예: "10,000원")
 * @example formatKoreanPrice(10000) // "10,000원"
 */
export const formatKoreanPrice = (price: number): string => `${price.toLocaleString()}원`;

/**
 * 소수를 퍼센트로 변환하여 포맷
 * @param rate - 변환할 소수 (0.1 = 10%)
 * @returns 퍼센트 문자열 (예: "10%")
 * @example formatPercentage(0.1) // "10%"
 */
export const formatPercentage = (rate: number): string => `${Math.round(rate * 100)}%`;
