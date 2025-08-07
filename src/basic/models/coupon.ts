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
 * 쿠폰 할인값 유효성을 검증하는 함수
 */
export const validateCouponDiscountValue = (
  discountType: "amount" | "percentage",
  discountValue: number
): { isValid: boolean; reason?: string; correctedValue?: number } => {
  if (discountType === "percentage") {
    if (discountValue > 100) {
      return {
        isValid: false,
        reason: "할인율은 100%를 초과할 수 없습니다",
        correctedValue: 100,
      };
    } else if (discountValue < 0) {
      return {
        isValid: false,
        correctedValue: 0,
      };
    }
  } else {
    if (discountValue > 100000) {
      return {
        isValid: false,
        reason: "할인 금액은 100,000원을 초과할 수 없습니다",
        correctedValue: 100000,
      };
    } else if (discountValue < 0) {
      return {
        isValid: false,
        correctedValue: 0,
      };
    }
  }

  return { isValid: true };
};

/**
 * 쿠폰 표시 텍스트를 생성하는 함수
 */
export const getCouponDisplayText = (coupon: Coupon): string => {
  if (coupon.discountType === "amount") {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  } else {
    return `${coupon.discountValue}% 할인`;
  }
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
