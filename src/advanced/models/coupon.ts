import { Coupon } from "../types";


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