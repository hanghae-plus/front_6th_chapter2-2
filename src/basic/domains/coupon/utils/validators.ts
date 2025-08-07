import type { Coupon } from "../types";

export function validateCouponUsage(coupon: Coupon, totalAmount: number) {
  if (totalAmount < 10000 && coupon.discountType === "percentage") {
    return {
      valid: false,
      message: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다."
    };
  }

  return {
    valid: true,
    message: "쿠폰이 적용되었습니다."
  };
}

export function validateCouponCode(code: string, existingCoupons: Coupon[]) {
  const existingCoupon = existingCoupons.find((c) => c.code === code);
  if (existingCoupon) {
    return {
      valid: false,
      message: "이미 존재하는 쿠폰 코드입니다."
    };
  }

  return {
    valid: true,
    message: "사용 가능한 쿠폰 코드입니다."
  };
}
