import {
  calculateAmountDiscount,
  calculatePercentageDiscount,
} from "@/basic/shared/utils/calculation.util";
import { Coupon, DiscountType } from "@/types";

const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === DiscountType.AMOUNT) {
    return calculateAmountDiscount(total, coupon.discountValue);
  }

  return calculatePercentageDiscount(total, coupon.discountValue);
};

export const couponModel = {
  applyCouponDiscount,
};
