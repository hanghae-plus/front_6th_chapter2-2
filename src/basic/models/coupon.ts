import { Coupon } from '../../types';

// 쿠폰 비즈니스 로직 (순수 함수)
// 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현된 함수들:
// 1. isCouponApplicable(coupon, cartTotal): 쿠폰 적용 가능 여부 확인
// 2. validateCouponCode(couponCode, coupons): 쿠폰 코드 중복 검증
// 3. formatCouponDisplay(coupon): 쿠폰 할인 표시 포맷
// 4. validateCouponDiscountValue(discountType, value): 쿠폰 할인값 검증
// 5. getCouponDiscountLabel(discountType): 쿠폰 할인 라벨 표시
// 6. getCouponDiscountPlaceholder(discountType): 쿠폰 placeholder 표시
// 7. calculateCouponDiscount(coupon, cartTotal): 쿠폰 할인액 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

// 쿠폰 적용 가능 여부 확인 (순수 함수)
export const isCouponApplicable = (coupon: Coupon, cartTotal: number): boolean => {
  if (cartTotal < 10000 && coupon.discountType === 'percentage') {
    return false;
  }
  return true;
};

// 쿠폰 코드 중복 검증 (순수 함수)
export const validateCouponCode = (couponCode: string, coupons: Coupon[]): boolean => {
  const existingCoupon = coupons.find((c) => c.code === couponCode);
  return !existingCoupon;
};

// 쿠폰 할인 표시 포맷 (순수 함수)
export const formatCouponDisplay = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};

// 쿠폰 할인값 검증 (순수 함수)
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

// 쿠폰 할인 라벨 표시 (순수 함수)
export const getCouponDiscountLabel = (discountType: 'amount' | 'percentage'): string => {
  return discountType === 'amount' ? '할인 금액' : '할인율(%)';
};

// 쿠폰 placeholder 표시 (순수 함수)
export const getCouponDiscountPlaceholder = (discountType: 'amount' | 'percentage'): string => {
  return discountType === 'amount' ? '5000' : '10';
};

// 쿠폰 할인액 계산 (순수 함수)
export const calculateCouponDiscount = (coupon: Coupon, cartTotal: number): number => {
  if (coupon.discountType === 'amount') {
    return coupon.discountValue;
  }
  return Math.round(cartTotal * (coupon.discountValue / 100));
};
