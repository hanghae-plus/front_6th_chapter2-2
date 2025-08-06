import { ICoupon } from "../type";

export const couponModel = {
  /**
   * 쿠폰 추가
   */
  addCoupon: (coupons: ICoupon[], newCoupon: ICoupon): ICoupon[] => {
    // 이미 존재하는 쿠폰인지 코드로 확인
    const exists = coupons.some((c) => c.code === newCoupon.code);
    // 이미 존재하면 그대로 반환
    if (exists) return coupons;

    // 새로운 쿠폰이면 추가
    return [...coupons, newCoupon];
  },

  /**
   * 쿠폰 삭제
   */
  deleteCoupon: (coupons: ICoupon[], couponCode: string): ICoupon[] => {
    const updatedCoupons = coupons.filter((c) => c.code !== couponCode);

    return updatedCoupons;
  },
};
