import { Coupon } from '../../types';

// 쿠폰 비즈니스 로직 (순수 함수)

// 쿠폰 적용 가능 여부 확인
export const isCouponApplicable = (coupon: Coupon, cartTotal: number): boolean => {
  if (cartTotal < 10000 && coupon.discountType === 'percentage') {
    return false;
  }
  return true;
};

// 쿠폰 코드 중복 검증
export const validateCouponCode = (couponCode: string, coupons: Coupon[]): boolean => {
  const existingCoupon = coupons.find((c) => c.code === couponCode);
  return !existingCoupon;
};

// 쿠폰 할인 표시 포맷
export const formatCouponDisplay = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};

// 쿠폰 할인값 검증
export const validateCouponDiscountValue = (
  discountType: 'amount' | 'percentage',
  value: number
): { isValid: boolean; correctedValue?: number; errorMessage?: string } => {
  if (discountType === 'percentage') {
    if (value > 100) {
      return {
        isValid: false,
        correctedValue: 100,
        errorMessage: '할인율은 100%를 초과할 수 없습니다',
      };
    }
    if (value < 0) {
      return { isValid: false, correctedValue: 0 };
    }
  } else {
    if (value > 100000) {
      return {
        isValid: false,
        correctedValue: 100000,
        errorMessage: '할인 금액은 100,000원을 초과할 수 없습니다',
      };
    }
    if (value < 0) {
      return { isValid: false, correctedValue: 0 };
    }
  }
  return { isValid: true };
};

// 쿠폰 할인 라벨 표시
export const getCouponDiscountLabel = (discountType: 'amount' | 'percentage'): string => {
  return discountType === 'amount' ? '할인 금액' : '할인율(%)';
};

// 쿠폰 placeholder 표시
export const getCouponDiscountPlaceholder = (discountType: 'amount' | 'percentage'): string => {
  return discountType === 'amount' ? '5000' : '10';
};

// 쿠폰 할인액 계산
export const calculateCouponDiscount = (coupon: Coupon, cartTotal: number): number => {
  if (coupon.discountType === 'amount') {
    return coupon.discountValue;
  }
  return Math.round(cartTotal * (coupon.discountValue / 100));
};
