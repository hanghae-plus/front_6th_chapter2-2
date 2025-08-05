import { z } from 'zod';

export const DISCOUNT_DEFAULTS = {
  QUANTITY: 10,
  RATE: 0.1
} as const;

export const discountTypeSchema = z.enum(['amount', 'percentage']);

export const discountSchema = z.object({
  quantity: z.number(),
  rate: z.number()
});

export type DiscountType = z.infer<typeof discountTypeSchema>;
export type Discount = z.infer<typeof discountSchema>;
