import { Coupon } from '../../types';

export const validateCouponApplication = (
  coupon: Coupon,
  cartTotalAfterDiscount: number
): { isValid: boolean; errorMessage?: string } => {
  if (cartTotalAfterDiscount < 10000 && coupon.discountType === 'percentage') {
    return {
      isValid: false,
      errorMessage: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
    };
  }

  return { isValid: true };
};

export const validateCouponCode = (
  newCouponCode: string,
  existingCoupons: Coupon[]
): { isValid: boolean; errorMessage?: string } => {
  const existingCoupon = existingCoupons.find((c) => c.code === newCouponCode);
  if (existingCoupon) {
    return {
      isValid: false,
      errorMessage: '이미 존재하는 쿠폰 코드입니다.',
    };
  }

  return { isValid: true };
};
