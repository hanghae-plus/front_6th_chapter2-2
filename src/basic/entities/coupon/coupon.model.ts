import { CouponWithUI } from "./coupon.types";
import { COUPON } from "../../constants";
import { generateId } from "../../utils/idGenerator";

/**
 * 쿠폰 비즈니스 로직 모델
 */
export const couponModel = {
  /**
   * 쿠폰 추가
   * @param coupons 현재 쿠폰 목록
   * @param newCoupon 새로운 쿠폰 데이터 (ID 제외)
   * @returns 업데이트된 쿠폰 목록
   */
  addCoupon: (
    coupons: CouponWithUI[],
    newCoupon: Omit<CouponWithUI, "id">
  ): CouponWithUI[] => {
    // 이미 존재하는 쿠폰인지 코드로 확인
    if (couponModel.isCouponExists(coupons, newCoupon.code)) {
      return coupons;
    }

    // 새로운 쿠폰이면 추가
    const coupon: CouponWithUI = {
      ...newCoupon,
      id: generateId("coupon"),
    };

    return [...coupons, coupon];
  },

  /**
   * 쿠폰 삭제
   * @param coupons 현재 쿠폰 목록
   * @param couponCode 삭제할 쿠폰 코드
   * @returns 업데이트된 쿠폰 목록
   */
  deleteCoupon: (
    coupons: CouponWithUI[],
    couponCode: string
  ): CouponWithUI[] => {
    return coupons.filter((c) => c.code !== couponCode);
  },

  /**
   * 쿠폰 코드로 쿠폰 찾기
   * @param coupons 쿠폰 목록
   * @param code 찾을 쿠폰 코드
   * @returns 찾은 쿠폰 또는 undefined
   */
  findCouponByCode: (
    coupons: CouponWithUI[],
    code: string
  ): CouponWithUI | undefined => {
    return coupons.find((c) => c.code === code);
  },

  /**
   * 쿠폰 ID로 쿠폰 찾기
   * @param coupons 쿠폰 목록
   * @param id 찾을 쿠폰 ID
   * @returns 찾은 쿠폰 또는 undefined
   */
  findCouponById: (
    coupons: CouponWithUI[],
    id: string
  ): CouponWithUI | undefined => {
    return coupons.find((c) => c.id === id);
  },

  /**
   * 쿠폰이 존재하는지 확인
   * @param coupons 쿠폰 목록
   * @param code 확인할 쿠폰 코드
   * @returns 존재 여부
   */
  isCouponExists: (coupons: CouponWithUI[], code: string): boolean => {
    return coupons.some((c) => c.code === code);
  },

  /**
   * 쿠폰 적용 가능 여부 확인
   * @param coupon 적용할 쿠폰
   * @param cartTotal 장바구니 총액
   * @returns 적용 가능 여부
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

  /**
   * 쿠폰 할인 금액 계산
   * @param coupon 적용할 쿠폰
   * @param cartTotal 장바구니 총액
   * @returns 할인 금액
   */
  calculateDiscountAmount: (
    coupon: CouponWithUI,
    cartTotal: number
  ): number => {
    if (!couponModel.canApplyCoupon(coupon, cartTotal)) {
      return 0;
    }

    if (coupon.discountType === "amount") {
      return Math.min(coupon.discountValue, cartTotal);
    } else {
      return Math.round(cartTotal * (coupon.discountValue / 100));
    }
  },
};
