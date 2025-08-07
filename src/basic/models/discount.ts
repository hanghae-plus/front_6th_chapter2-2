import { Coupon } from "../../types";

/**
 * 쿠폰 적용 가능 여부를 검증하는 함수
 */
export const canApplyCoupon = (
  coupon: Coupon,
  cartTotal: number
): { canApply: boolean; reason?: string } => {
  // percentage 쿠폰은 10,000원 이상 구매 시에만 사용 가능
  if (coupon.discountType === "percentage" && cartTotal < 10000) {
    return {
      canApply: false,
      reason: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
    };
  }

  return { canApply: true };
};

/**
 * 쿠폰 할인 금액을 계산하는 함수
 */
export const calculateCouponDiscount = (
  coupon: Coupon,
  amount: number
): number => {
  if (coupon.discountType === "amount") {
    return Math.min(coupon.discountValue, amount);
  } else {
    return Math.round(amount * (coupon.discountValue / 100));
  }
};

/**
 * 쿠폰 유효성을 검증하는 함수 (중복 코드 검증)
 */
export const validateCoupon = (
  newCoupon: Coupon,
  existingCoupons: Coupon[]
): { isValid: boolean; reason?: string } => {
  const existingCoupon = existingCoupons.find((c) => c.code === newCoupon.code);

  if (existingCoupon) {
    return {
      isValid: false,
      reason: "이미 존재하는 쿠폰 코드입니다.",
    };
  }

  return { isValid: true };
};

/**
 * 쿠폰이 적용된 최종 금액을 계산하는 함수
 */
export const applyCouponToAmount = (
  amount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) {
    return amount;
  }

  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  } else {
    return Math.round(amount * (1 - coupon.discountValue / 100));
  }
};
