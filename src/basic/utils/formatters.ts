// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현

/**
 * 가격을 한국 원화 형식으로 포맷
 * @param price 가격
 * @param format 포맷 타입 (text: 원화 텍스트, symbol: 원화 기호)
 * @returns 포맷된 가격
 */
export const formatKRWPrice = (price: number, format: 'text' | 'symbol' = 'text'): string => {
  return format === 'text' ? `${price.toLocaleString()}원` : `₩${price.toLocaleString()}`;
};
