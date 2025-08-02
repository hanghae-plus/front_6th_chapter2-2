import { z } from 'zod';

export const couponDiscountTypeSchema = z.enum(['amount', 'percentage']);

export const couponSchema = z.object({
  name: z.string(),
  code: z.string(),
  discountType: couponDiscountTypeSchema,
  discountValue: z.number(),
});

export type Coupon = z.infer<typeof couponSchema>;

export const calculateCouponDiscount = (
  totalAfterItemDiscounts: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return 0;

  if (
    couponDiscountTypeSchema
      .extract([couponDiscountTypeSchema.enum.amount])
      .safeParse(coupon.discountType).success
  ) {
    return Math.min(coupon.discountValue, totalAfterItemDiscounts);
  } else {
    return Math.round(totalAfterItemDiscounts * (coupon.discountValue / 100));
  }
};

export const isValidPercentageCoupon = (coupon: Coupon): boolean => {
  return coupon.discountType === couponDiscountTypeSchema.enum.percentage;
};

export const isValidAmountCoupon = (coupon: Coupon): boolean => {
  return coupon.discountType === couponDiscountTypeSchema.enum.amount;
};
