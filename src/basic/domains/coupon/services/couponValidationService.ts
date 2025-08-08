import type { ValidationResult } from "../../../shared";
import type { Coupon } from "../types";

export const couponValidationService = {
  validateCouponCode: (code: string, existingCoupons: Coupon[]): ValidationResult => {
    const existingCoupon = existingCoupons.find((c) => c.code === code);
    return existingCoupon
      ? { valid: false, message: "이미 존재하는 쿠폰 코드입니다." }
      : { valid: true, message: "사용 가능한 쿠폰 코드입니다." };
  },

  validateCouponUsage: (coupon: Coupon, totalAmount: number): ValidationResult => {
    return totalAmount < 10000 && coupon.discountType === "percentage"
      ? { valid: false, message: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다." }
      : { valid: true, message: "쿠폰이 적용되었습니다." };
  }
};
