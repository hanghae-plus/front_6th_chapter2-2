import { z } from 'zod';
import { discountSchema } from './discount';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  discounts: z.array(discountSchema),
});

export const productViewSchema = productSchema.extend({
  description: z.string().optional(),
  isRecommended: z.boolean().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductView = z.infer<typeof productViewSchema>;
