import { z } from 'zod';

export const couponDiscountTypeSchema = z.enum(['amount', 'percentage']);

export const couponSchema = z.object({
  name: z.string(),
  code: z.string(),
  discountType: couponDiscountTypeSchema,
  discountValue: z.number()
});

export type Coupon = z.infer<typeof couponSchema>;

export const calculateCouponDiscount = (
  totalAfterItemDiscounts: number,
  selectedCoupon: Nullable<Coupon>
): number => {
  if (!selectedCoupon) return 0;

  if (
    couponDiscountTypeSchema
      .extract([couponDiscountTypeSchema.enum.amount])
      .safeParse(selectedCoupon.discountType).success
  ) {
    return Math.min(selectedCoupon.discountValue, totalAfterItemDiscounts);
  } else {
    return Math.round(
      totalAfterItemDiscounts * (selectedCoupon.discountValue / 100)
    );
  }
};

export const isValidPercentageCoupon = (coupon: Coupon): boolean => {
  return coupon.discountType === couponDiscountTypeSchema.enum.percentage;
};

export const isValidAmountCoupon = (coupon: Coupon): boolean => {
  return coupon.discountType === couponDiscountTypeSchema.enum.amount;
};

export const isMaxPercentageCoupon = (
  type: z.infer<typeof couponDiscountTypeSchema>,
  value: number
): boolean => {
  return type === couponDiscountTypeSchema.enum.percentage && value > 100;
};

export const isMinAmountCoupon = (
  type: z.infer<typeof couponDiscountTypeSchema>,
  value: number
): boolean => {
  return type === couponDiscountTypeSchema.enum.amount && value < 0;
};

export const isMaxAmountCoupon = (
  type: z.infer<typeof couponDiscountTypeSchema>,
  value: number
): boolean => {
  return type === couponDiscountTypeSchema.enum.amount && value > 1000000;
};

export const isMinPercentageCoupon = (
  type: z.infer<typeof couponDiscountTypeSchema>,
  value: number
): boolean => {
  return type === couponDiscountTypeSchema.enum.percentage && value < 0;
};
