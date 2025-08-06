import { CouponWithUI } from "./coupon.types";
import { COUPON } from "../../constants";

// 고유 ID 생성을 위한 카운터
let idCounter = 0;

export const couponModel = {
  /**
   * 쿠폰 추가
   */
  addCoupon: (
    coupons: CouponWithUI[],
    newCoupon: Omit<CouponWithUI, "id">
  ): CouponWithUI[] => {
    // 이미 존재하는 쿠폰인지 코드로 확인
    const exists = coupons.some((c) => c.code === newCoupon.code);
    // 이미 존재하면 그대로 반환
    if (exists) return coupons;

    // 새로운 쿠폰이면 추가 (고유 id 생성)
    const coupon: CouponWithUI = {
      ...newCoupon,
      id: `c${Date.now()}-${++idCounter}`, // 쿠폰 고유 아이디 (시간 + 카운터)
    };

    return [...coupons, coupon];
  },

  /**
   * 쿠폰 삭제
   */
  deleteCoupon: (
    coupons: CouponWithUI[],
    couponCode: string
  ): CouponWithUI[] => {
    return coupons.filter((c) => c.code !== couponCode);
  },

  /**
   * 쿠폰 코드로 쿠폰 찾기
   */
  findCouponByCode: (
    coupons: CouponWithUI[],
    code: string
  ): CouponWithUI | undefined => {
    return coupons.find((c) => c.code === code);
  },

  /**
   * 쿠폰이 존재하는지 확인
   */
  isCouponExists: (coupons: CouponWithUI[], code: string): boolean => {
    return coupons.some((c) => c.code === code);
  },

  /**
   * 쿠폰 적용 가능 여부 확인
   */
  canApplyCoupon: (coupon: CouponWithUI, cartTotal: number): boolean => {
    if (
      coupon.discountType === "percentage" &&
      cartTotal < COUPON.MIN_AMOUNT_FOR_PERCENTAGE
    ) {
      return false;
    }
    return true;
  },
};
