import { Coupon } from "../../types";

/**
 * 쿠폰을 추가하는 함수
 */
export const addCoupon = (coupons: Coupon[], newCoupon: Coupon): Coupon[] => {
  return [...coupons, newCoupon];
};

/**
 * 쿠폰을 삭제하는 함수
 */
export const deleteCoupon = (
  coupons: Coupon[],
  couponCode: string
): Coupon[] => {
  return coupons.filter((c) => c.code !== couponCode);
};

/**
 * 주문번호를 생성하는 함수
 */
export const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}`;
};

/**
 * 선택된 쿠폰이 삭제되었는지 확인하고 선택 해제하는 함수
 */
export const checkAndClearSelectedCoupon = (
  selectedCoupon: Coupon | null,
  deletedCouponCode: string
): Coupon | null => {
  if (selectedCoupon?.code === deletedCouponCode) {
    return null;
  }
  return selectedCoupon;
};
