import { Coupon } from '../types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const couponService = {
  /**
   * 쿠폰 적용 가능 여부 검증
   */
  validateCouponApplication: (
    coupon: Coupon,
    cartTotal: number
  ): ValidationResult => {
    if (cartTotal < 10000 && coupon.discountType === 'percentage') {
      return {
        isValid: false,
        message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
      };
    }

    return {
      isValid: true,
      message: '쿠폰이 적용되었습니다.',
    };
  },

  /**
   * 쿠폰 코드 중복 검증
   */
  checkDuplicateCoupon: (
    newCoupon: Coupon,
    existingCoupons: Coupon[]
  ): ValidationResult => {
    const existingCoupon = existingCoupons.find(c => c.code === newCoupon.code);

    if (existingCoupon) {
      return {
        isValid: false,
        message: '이미 존재하는 쿠폰 코드입니다.',
      };
    }

    return {
      isValid: true,
      message: '쿠폰이 추가되었습니다.',
    };
  },

  /**
   * 쿠폰 삭제 시 선택된 쿠폰 확인
   */
  shouldClearSelectedCoupon: (
    deletedCouponCode: string,
    selectedCoupon: Coupon | null
  ): boolean => {
    return selectedCoupon?.code === deletedCouponCode;
  },
};
