// 쿠폰 검증 관련 상수
export const COUPON_LIMITS = {
  PERCENTAGE_MAX: 100,
  AMOUNT_MAX: 100000,
  MIN_VALUE: 0,
} as const;

// 할인값 검증 함수들
export const validateDiscountValue = (
  value: number,
  discountType: "amount" | "percentage"
): { isValid: boolean; errorMessage?: string; correctedValue?: number } => {
  if (value < COUPON_LIMITS.MIN_VALUE) {
    return {
      isValid: false,
      errorMessage: "할인값은 0 이상이어야 합니다",
      correctedValue: COUPON_LIMITS.MIN_VALUE,
    };
  }

  if (discountType === "percentage") {
    if (value > COUPON_LIMITS.PERCENTAGE_MAX) {
      return {
        isValid: false,
        errorMessage: "할인율은 100%를 초과할 수 없습니다",
        correctedValue: COUPON_LIMITS.PERCENTAGE_MAX,
      };
    }
  } else {
    if (value > COUPON_LIMITS.AMOUNT_MAX) {
      return {
        isValid: false,
        errorMessage: "할인 금액은 100,000원을 초과할 수 없습니다",
        correctedValue: COUPON_LIMITS.AMOUNT_MAX,
      };
    }
  }

  return { isValid: true };
};

// 숫자 입력값 검증
export const validateNumericInput = (value: string): { isValid: boolean; numericValue: number } => {
  if (value === "" || /^\d+$/.test(value)) {
    return {
      isValid: true,
      numericValue: value === "" ? 0 : parseInt(value),
    };
  }
  return { isValid: false, numericValue: 0 };
};
