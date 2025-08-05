import {
  calculateAmountDiscount,
  calculatePercentageDiscount,
} from "@/basic/utils/calculation.util";
import { Coupon } from "@/types";

export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return calculateAmountDiscount(total, coupon.discountValue);
  }

  return calculatePercentageDiscount(total, coupon.discountValue);
};
