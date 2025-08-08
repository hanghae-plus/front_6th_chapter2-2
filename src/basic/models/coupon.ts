import { Coupon } from "../../types";
import { safeParseNumber } from "../utils/validators";
import { COUPON_CONSTRAINTS, COUPON_ERROR_MESSAGES } from "../constants/coupon";

/**
 * 쿠폰 코드 입력 처리 (AdminPage onChange에서 사용)
 */
export function handleCouponCodeInput(value: string): string {
  // 대문자 변환 + 영문/숫자만 허용
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * 할인값 입력 처리 (AdminPage onChange에서 사용)
 */
export function handleDiscountValueInput(
  value: string,
  discountType: "amount" | "percentage"
): {
  discountValue: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (value === "") {
    return { discountValue: 0, isValid: true };
  }

  // 숫자만 허용
  if (!/^\d+$/.test(value)) {
    return {
      discountValue: 0,
      isValid: false,
      errorMessage: COUPON_ERROR_MESSAGES.ONLY_NUMBERS,
    };
  }

  const discountValue = safeParseNumber(value);

  // 타입별 상한선 체크
  if (
    discountType === "percentage" &&
    discountValue > COUPON_CONSTRAINTS.MAX_PERCENTAGE
  ) {
    return {
      discountValue: COUPON_CONSTRAINTS.MAX_PERCENTAGE,
      isValid: false,
      errorMessage: COUPON_ERROR_MESSAGES.PERCENTAGE_OVER_MAX,
    };
  }

  if (
    discountType === "amount" &&
    discountValue > COUPON_CONSTRAINTS.MAX_AMOUNT
  ) {
    return {
      discountValue: COUPON_CONSTRAINTS.MAX_AMOUNT,
      isValid: false,
      errorMessage: COUPON_ERROR_MESSAGES.AMOUNT_OVER_MAX,
    };
  }

  return { discountValue, isValid: true };
}

/**
 * 할인값 검증 (AdminPage onBlur에서 사용)
 */
export function validateDiscountValue(
  value: string,
  discountType: "amount" | "percentage"
): {
  isValid: boolean;
  correctedValue: number;
  errorMessage?: string;
} {
  const discountValue = safeParseNumber(value);

  if (discountType === "percentage") {
    if (discountValue > COUPON_CONSTRAINTS.MAX_PERCENTAGE) {
      return {
        isValid: false,
        correctedValue: COUPON_CONSTRAINTS.MAX_PERCENTAGE,
        errorMessage: COUPON_ERROR_MESSAGES.PERCENTAGE_OVER_MAX,
      };
    }
    if (discountValue < COUPON_CONSTRAINTS.MIN_PERCENTAGE) {
      return {
        isValid: false,
        correctedValue: COUPON_CONSTRAINTS.MIN_PERCENTAGE,
        errorMessage: COUPON_ERROR_MESSAGES.PERCENTAGE_UNDER_MIN,
      };
    }
  } else {
    if (discountValue > COUPON_CONSTRAINTS.MAX_AMOUNT) {
      return {
        isValid: false,
        correctedValue: COUPON_CONSTRAINTS.MAX_AMOUNT,
        errorMessage: COUPON_ERROR_MESSAGES.AMOUNT_OVER_MAX,
      };
    }
    if (discountValue < COUPON_CONSTRAINTS.MIN_AMOUNT) {
      return {
        isValid: false,
        correctedValue: COUPON_CONSTRAINTS.MIN_AMOUNT,
        errorMessage: COUPON_ERROR_MESSAGES.AMOUNT_UNDER_MIN,
      };
    }
  }
  return { isValid: true, correctedValue: discountValue };
}

/**
 * 쿠폰 폼 전체 검증
 */
export function validateCouponForm(formData: {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push(COUPON_ERROR_MESSAGES.NAME_REQUIRED);
  }

  if (!formData.code.trim()) {
    errors.push(COUPON_ERROR_MESSAGES.CODE_REQUIRED);
  }

  if (formData.discountValue <= 0) {
    errors.push(COUPON_ERROR_MESSAGES.DISCOUNT_VALUE_REQUIRED);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 쿠폰 설명 포맷팅 (AdminPage에서 사용)
 */
export function formatCouponDescription(coupon: Coupon): string {
  if (coupon.discountType === "amount") {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  } else {
    return `${coupon.discountValue}% 할인`;
  }
}
