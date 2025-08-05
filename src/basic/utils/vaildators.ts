export const validator = {
  /**
   * 문자열 전체가 숫자인 경우만 반환
   */
  extractNumbers: (value: string): string | null => {
    if (value === "") return "";
    if (/^\d+$/.test(value)) return value;

    return null;
  },

  /**
   * 재고 수량 검증 (0 ~ 9999)
   */
  isValidStock: (
    stock: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (stock <= 0)
      return {
        isValid: false,
        message: "재고는 0보다 커야 합니다",
        correctedValue: 0,
      };
    if (stock > 9999)
      return {
        isValid: false,
        message: "재고는 9999개를 초과할 수 없습니다",
        correctedValue: 9999,
      };

    return { isValid: true, message: "", correctedValue: stock };
  },

  /**
   * 가격 검증 (0 이상)
   */
  isValidPrice: (
    price: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (price <= 0)
      return {
        isValid: false,
        message: "가격은 0보다 커야 합니다",
        correctedValue: 0,
      };

    return { isValid: true, message: "", correctedValue: price };
  },

  /**
   * 쿠폰 할인율 검증 (0 ~ 100)
   */
  isValidDiscountPercentage: (
    value: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (value < 0)
      return {
        isValid: false,
        message: "할인율은 0% 이상이어야 합니다",
        correctedValue: 0,
      };
    if (value > 100)
      return {
        isValid: false,
        message: "할인율은 100%를 초과할 수 없습니다",
        correctedValue: 100,
      };
    return { isValid: true, message: "", correctedValue: value };
  },

  /**
   * 쿠폰 할인 금액 검증 (0 ~ 100000)
   */
  isValidDiscountAmount: (
    value: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (value < 0)
      return {
        isValid: false,
        message: "할인 금액은 0원 이상이어야 합니다",
        correctedValue: 0,
      };
    if (value > 100000)
      return {
        isValid: false,
        message: "할인 금액은 100,000원을 초과할 수 없습니다",
        correctedValue: 100000,
      };
    return { isValid: true, message: "", correctedValue: value };
  },
};
