import { STOCK_STATUS } from '@/models/product';
import { z } from 'zod';

export const numberInputSchema = z
  .string()
  .refine(value => value === '' || /^\d+$/.test(value), {
    message: '숫자만 입력 가능합니다'
  })
  .transform(value => (value === '' ? 0 : parseInt(value)));

export const priceSchema = numberInputSchema.refine(num => num >= 0, {
  message: '가격은 0보다 커야 합니다'
});

export const stockSchema = numberInputSchema
  .refine(num => num >= 0, { message: '재고는 0보다 커야 합니다' })
  .refine(num => num <= STOCK_STATUS.MAX, {
    message: `재고는 ${STOCK_STATUS.MAX}개를 초과할 수 없습니다`
  });
