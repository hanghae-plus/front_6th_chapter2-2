import { Coupon } from "../../types";

export const applyCouponDiscount = (
  totalAfterDiscount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return totalAfterDiscount;

  switch (coupon.discountType) {
    case "amount":
      return Math.max(0, totalAfterDiscount - coupon.discountValue);
    case "percentage":
      return Math.round(totalAfterDiscount * (1 - coupon.discountValue / 100));
  }
};
