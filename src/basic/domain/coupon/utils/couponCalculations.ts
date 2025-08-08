import { Coupon } from "../models";

/**
 * 쿠폰 코드를 생성하는 순수 함수
 */
export const generateCouponCode = (name: string): string => {
  return name.replace(/\s+/g, "").toUpperCase() + Date.now();
};

/**
 * 쿠폰 배열에서 특정 코드의 쿠폰을 찾는 순수 함수
 */
export const validateCoupon = (
  coupons: Coupon[],
  couponCode: string
): Coupon | null => {
  const coupon = coupons.find((c) => c.code === couponCode);
  return coupon || null;
};

/**
 * 쿠폰 적용 가능 여부를 확인하는 순수 함수
 */
export const canApplyCoupon = (
  coupons: Coupon[],
  couponCode: string,
  cartTotal: number
): boolean => {
  const coupon = validateCoupon(coupons, couponCode);
  if (!coupon) return false;

  // percentage 쿠폰은 10,000원 이상 구매 시에만 사용 가능
  if (coupon.discountType === "percentage" && cartTotal < 10000) {
    return false;
  }

  return true;
};

/**
 * 할인 금액을 계산하는 순수 함수
 */
export const calculateDiscount = (
  coupon: Coupon,
  cartTotal: number
): number => {
  if (coupon.discountType === "amount") {
    return Math.min(coupon.discountValue, cartTotal);
  } else {
    return Math.round(cartTotal * (coupon.discountValue / 100));
  }
};

/**
 * 최종 금액을 계산하는 순수 함수
 */
export const calculateFinalAmount = (
  coupon: Coupon,
  cartTotal: number
): number => {
  const discount = calculateDiscount(coupon, cartTotal);
  return Math.max(0, cartTotal - discount);
};
