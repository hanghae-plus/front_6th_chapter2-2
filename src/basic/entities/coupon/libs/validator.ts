import { Coupon, DiscountType } from "../../../../types";

const ERROR_MESSAGES = {
  COUPON_NAME_REQUIRED: "쿠폰명을 입력해주세요.",
  COUPON_CODE_REQUIRED: "쿠폰 코드를 입력해주세요.",
  PERCENTAGE_EXCEED_100: "할인율은 100%를 초과할 수 없습니다",
  PERCENTAGE_BELOW_0: "할인율은 0% 미만일 수 없습니다.",
  AMOUNT_EXCEED_100000: "할인 금액은 100,000원을 초과할 수 없습니다",
  AMOUNT_BELOW_0: "할인 금액은 0원 미만일 수 없습니다.",
} as const;

export interface CouponValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateCoupon(
  coupon: Partial<Coupon>
): CouponValidationResult {
  const errors: Record<string, string> = {};

  if (!coupon.name || coupon.name.trim() === "") {
    errors.name = ERROR_MESSAGES.COUPON_NAME_REQUIRED;
  }

  if (!coupon.code || coupon.code.trim() === "") {
    errors.code = ERROR_MESSAGES.COUPON_CODE_REQUIRED;
  }

  if (coupon.discountValue !== undefined) {
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      if (coupon.discountValue > 100) {
        errors.discountValue = ERROR_MESSAGES.PERCENTAGE_EXCEED_100;
      } else if (coupon.discountValue < 0) {
        errors.discountValue = ERROR_MESSAGES.PERCENTAGE_BELOW_0;
      }
    } else if (coupon.discountType === DiscountType.AMOUNT) {
      if (coupon.discountValue > 100000) {
        errors.discountValue = ERROR_MESSAGES.AMOUNT_EXCEED_100000;
      } else if (coupon.discountValue < 0) {
        errors.discountValue = ERROR_MESSAGES.AMOUNT_BELOW_0;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateDiscountValue(
  value: number,
  discountType: DiscountType
): { valid: boolean; error?: string; correctedValue?: number } {
  if (discountType === DiscountType.PERCENTAGE) {
    if (value > 100) {
      return {
        valid: false,
        error: ERROR_MESSAGES.PERCENTAGE_EXCEED_100,
        correctedValue: 100,
      };
    } else if (value < 0) {
      return {
        valid: false,
        error: ERROR_MESSAGES.PERCENTAGE_BELOW_0,
        correctedValue: 0,
      };
    }
  } else {
    if (value > 100000) {
      return {
        valid: false,
        error: ERROR_MESSAGES.AMOUNT_EXCEED_100000,
        correctedValue: 100000,
      };
    } else if (value < 0) {
      return {
        valid: false,
        error: ERROR_MESSAGES.AMOUNT_BELOW_0,
        correctedValue: 0,
      };
    }
  }

  return { valid: true };
}
