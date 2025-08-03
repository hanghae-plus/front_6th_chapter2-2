import { Coupon } from "../types";

// 쿠폰 사용 가능 여부 확인
export function validateCouponUsage(
  coupon: Coupon,
  cartTotal: number
): { canUse: boolean; reason?: string } {
  const MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON = 10000;

  if (
    coupon.discountType === "percentage" &&
    cartTotal < MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON
  ) {
    return {
      canUse: false,
      reason: `percentage 쿠폰은 ${MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
    };
  }

  return { canUse: true };
}

// 쿠폰 코드 중복 확인
export function checkDuplicateCoupon(
  coupons: Coupon[],
  couponCode: string
): boolean {
  return coupons.some((c) => c.code === couponCode);
}

// 쿠폰 추가 (불변성 유지)
export function addCouponToList(
  coupons: Coupon[],
  newCoupon: Coupon
): Coupon[] {
  return [...coupons, newCoupon];
}

// 쿠폰 제거 (불변성 유지)
export function removeCouponFromList(
  coupons: Coupon[],
  couponCode: string
): Coupon[] {
  return coupons.filter((c) => c.code !== couponCode);
}