import { Coupon } from "../../types";
import {
  COUPON_TYPE_AMOUNT,
  COUPON_TYPE_PERCENTAGE,
} from "../constants/coupon";

// 쿠폰 할인 적용
export const applyCouponDiscount = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon
): number => {
  if (selectedCoupon.discountType === COUPON_TYPE_AMOUNT) {
    return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  }

  if (selectedCoupon.discountType === COUPON_TYPE_PERCENTAGE) {
    const discountMultiplier = 1 - selectedCoupon.discountValue / 100;
    return Math.round(totalAfterDiscount * discountMultiplier);
  }

  return totalAfterDiscount;
};
