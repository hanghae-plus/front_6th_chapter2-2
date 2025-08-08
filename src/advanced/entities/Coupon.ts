import { Coupon } from '../../types';

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