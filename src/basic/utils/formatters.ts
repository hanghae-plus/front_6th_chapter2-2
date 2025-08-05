// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

/**
 * 가격을 한국 원화 형식으로 포맷팅하는 함수
 * @param price - 포맷팅할 가격 (숫자)
 * @param isSoldOut - 품절 여부
 * @param isAdmin - 관리자 모드 여부
 * @returns 포맷팅된 가격 문자열
 */
export const formatPrice = (price: number, isSoldOut: boolean, isAdmin: boolean): string => {
  if (isSoldOut) {
    return 'SOLD OUT';
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
