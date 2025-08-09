import { Coupon } from "../../types";
import { COUPON_VALIDATION_RULES } from "../constants/coupon";

// 쿠폰 할인 적용
export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (!coupon) return total;

  if (coupon.discountType === "amount") {
    return Math.max(0, total - coupon.discountValue);
  } else if (coupon.discountType === "percentage") {
    const discountAmount = (total * coupon.discountValue) / 100;
    return Math.max(0, total - discountAmount);
  }

  return total;
};

// 쿠폰 코드 생성
export const generateCouponCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 쿠폰 데이터 검증
export const validateCouponData = (coupon: Partial<Coupon>): boolean => {
  if (
    !coupon.name ||
    !coupon.code ||
    !coupon.discountType ||
    !coupon.discountValue
  ) {
    return false;
  }

  if (coupon.discountType === "amount") {
    return (
      coupon.discountValue >= COUPON_VALIDATION_RULES.MIN_AMOUNT_DISCOUNT &&
      coupon.discountValue <= COUPON_VALIDATION_RULES.MAX_AMOUNT_DISCOUNT
    );
  } else if (coupon.discountType === "percentage") {
    return (
      coupon.discountValue >= COUPON_VALIDATION_RULES.MIN_PERCENTAGE_DISCOUNT &&
      coupon.discountValue <= COUPON_VALIDATION_RULES.MAX_PERCENTAGE_DISCOUNT
    );
  }

  return false;
};

// 쿠폰 중복 검사
export const isCouponDuplicate = (coupons: Coupon[], code: string): boolean => {
  return coupons.some((coupon) => coupon.code === code);
};

// 쿠폰 표시 텍스트 생성
export const getCouponDisplayText = (coupon: Coupon): string => {
  if (coupon.discountType === "amount") {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  } else {
    return `${coupon.discountValue}% 할인`;
  }
};
