import { z } from 'zod';

export const discountTypeSchema = z.enum(['amount', 'percentage']);

export const discountSchema = z.object({
  quantity: z.number(),
  rate: z.number(),
});

export type DiscountType = z.infer<typeof discountTypeSchema>;
export type Discount = z.infer<typeof discountSchema>;
