// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// TODO: 구현

export const validator = {
  /**
   * 문자열에서 숫자만 추출
   */
  extractNumbers: (value: string): string => {
    return value.replace(/\D/g, "");
  },

  /**
   * 재고 수량 검증 (0 이상)
   */
  isValidStock: (stock: number): { isValid: boolean; message: string } => {
    if (stock <= 0)
      return { isValid: false, message: "재고는 0보다 커야 합니다" };
    else if (stock > 9999)
      return { isValid: false, message: "재고는 9999개를 초과할 수 없습니다" };

    return { isValid: true, message: "" };
  },

  /**
   * 가격 검증 (양수)
   */
  isValidPrice: (price: number): { isValid: boolean; message: string } => {
    if (price <= 0)
      return { isValid: false, message: "가격은 0보다 커야 합니다" };

    return { isValid: true, message: "" };
  },
};
