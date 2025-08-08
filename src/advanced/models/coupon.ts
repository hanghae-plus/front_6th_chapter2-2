import { Coupon } from "../../types";

// 쿠폰 할인 계산
export const calculateCouponDiscount = (amount: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  } else {
    return Math.round(amount * (1 - coupon.discountValue / 100));
  }
};

// 쿠폰 중복 확인
export const isDuplicateCoupon = (coupons: Coupon[], newCoupon: Coupon): boolean => {
  return coupons.some((coupon) => coupon.code === newCoupon.code);
};

// 쿠폰 사용 조건 확인
export const checkCouponUsageConditions = (
  amount: number,
  coupon: Coupon,
  minimumAmount: number = 10000
): {
  canUse: boolean;
  reason?: string;
} => {
  if (amount < minimumAmount) {
    return {
      canUse: false,
      reason: `최소 주문 금액 ${minimumAmount.toLocaleString()}원 이상 필요`,
    };
  }

  if (coupon.discountType === "percentage" && amount < minimumAmount) {
    return {
      canUse: false,
      reason: `퍼센트 할인 쿠폰은 ${minimumAmount.toLocaleString()}원 이상 주문 시 사용 가능`,
    };
  }

  return {
    canUse: true,
  };
};
