import { Coupon } from '../../types';

// 쿠폰 적용 가능 여부 검증
export const canApplyCoupon = (
  coupon: Coupon,
  totalAmount: number
): boolean => {
  if (coupon.discountType === 'percentage' && totalAmount < 10000) {
    return false;
  }
  return true;
};

// 쿠폰 적용 후 할인 금액 계산
export const applyCouponDiscount = (
  totalAmount: number,
  coupon: Coupon
): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, totalAmount - coupon.discountValue);
  } else {
    return Math.round(totalAmount * (1 - coupon.discountValue / 100));
  }
};

// 쿠폰 중복 확인
export const isCouponCodeDuplicate = (
  coupons: Coupon[],
  code: string
): boolean => {
  return coupons.some(c => c.code === code);
};

// 쿠폰 할인 표시 포맷
export const formatCouponDiscount = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  } else {
    return `${coupon.discountValue}% 할인`;
  }
};

// 쿠폰 찾기
export const findCouponByCode = (
  coupons: Coupon[],
  code: string
): Coupon | undefined => {
  return coupons.find(c => c.code === code);
};

// 쿠폰 적용 에러 메시지
export const getCouponApplicationError = (
  coupon: Coupon,
  totalAmount: number
): string | null => {
  if (coupon.discountType === 'percentage' && totalAmount < 10000) {
    return 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.';
  }
  return null;
};