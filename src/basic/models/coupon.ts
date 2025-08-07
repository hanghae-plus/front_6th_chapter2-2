import { Coupon } from '../../types';

export const couponModel = {
  /**
   * 쿠폰 추가
   * @param coupons - 쿠폰 목록
   * @param newCoupon - 추가할 쿠폰
   * @returns 쿠폰 목록
   */
  addCoupon: (coupons: Coupon[], newCoupon: Coupon): Coupon[] => {
    const exists = coupons.some((coupon) => coupon.code === newCoupon.code);
    // 이미 존재하면 그대로 반환
    if (exists) return coupons;

    return [...coupons, newCoupon];
  },

  /**
   * 쿠폰 삭제
   * @param coupons - 쿠폰 목록
   * @param couponCode - 삭제할 쿠폰 코드
   * @returns 쿠폰 목록
   */
  deleteCoupon: (coupons: Coupon[], couponCode: string): Coupon[] => {
    const updatedCoupons = coupons.filter((c) => c.code !== couponCode);

    return updatedCoupons;
  },
};
