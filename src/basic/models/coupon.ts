import { Coupon } from "../../types";

// 쿠폰 할인 계산 (순수 함수)
export const calculateCouponDiscount = (amount: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  } else {
    return Math.round(amount * (1 - coupon.discountValue / 100));
  }
};

// 쿠폰 할인 금액 계산
export const calculateCouponDiscountAmount = (amount: number, coupon: Coupon): number => {
  const discountedAmount = calculateCouponDiscount(amount, coupon);
  return Math.max(0, amount - discountedAmount);
};

// 쿠폰 적용 가능 여부 확인
export const isCouponApplicable = (amount: number, coupon: Coupon, minimumAmount?: number): boolean => {
  // 최소 주문 금액 체크
  if (minimumAmount && amount < minimumAmount) {
    return false;
  }

  // 퍼센트 할인 쿠폰의 경우 최소 주문 금액 체크 (기본 10,000원)
  if (coupon.discountType === "percentage" && amount < (minimumAmount || 10000)) {
    return false;
  }

  return true;
};

// 쿠폰 유효성 검사
export const validateCoupon = (
  coupon: Coupon
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!coupon.name || coupon.name.trim().length === 0) {
    errors.push("쿠폰명은 필수입니다.");
  }

  if (!coupon.code || coupon.code.trim().length === 0) {
    errors.push("쿠폰 코드는 필수입니다.");
  }

  if (coupon.discountValue <= 0) {
    errors.push("할인 값은 0보다 커야 합니다.");
  }

  if (coupon.discountType === "percentage" && coupon.discountValue > 100) {
    errors.push("퍼센트 할인은 100%를 초과할 수 없습니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 쿠폰 중복 확인
export const isDuplicateCoupon = (coupons: Coupon[], newCoupon: Coupon): boolean => {
  return coupons.some((coupon) => coupon.code === newCoupon.code);
};

// 쿠폰 코드로 쿠폰 찾기
export const findCouponByCode = (coupons: Coupon[], code: string): Coupon | undefined => {
  return coupons.find((coupon) => coupon.code === code);
};

// 쿠폰 할인율 계산 (퍼센트)
export const calculateCouponDiscountRate = (coupon: Coupon, originalAmount: number): number => {
  if (originalAmount === 0) return 0;

  if (coupon.discountType === "percentage") {
    return coupon.discountValue;
  } else {
    const discountAmount = Math.min(coupon.discountValue, originalAmount);
    return Math.round((discountAmount / originalAmount) * 100);
  }
};

// 쿠폰 정보 포맷팅
export const formatCouponInfo = (coupon: Coupon): string => {
  if (coupon.discountType === "amount") {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  } else {
    return `${coupon.discountValue}% 할인`;
  }
};

// 쿠폰 적용 후 최종 금액 계산
export const calculateFinalAmountWithCoupon = (originalAmount: number, coupon: Coupon | null): number => {
  if (!coupon) {
    return originalAmount;
  }

  return calculateCouponDiscount(originalAmount, coupon);
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
