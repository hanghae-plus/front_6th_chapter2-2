import { Coupon } from "../../types";
import { applyPercentage } from "../utils/calculators";

export const applyCouponDiscount = (
  totalAfterDiscount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return totalAfterDiscount;

  switch (coupon.discountType) {
    case "amount":
      return Math.max(0, totalAfterDiscount - coupon.discountValue);
    case "percentage":
      return applyPercentage(totalAfterDiscount, coupon.discountValue);
  }
};
