import type { Discount } from '../../types';

interface ApplyDiscountParams {
  price: number;
  discount: number;
}

// 할인 적용
export function applyDiscount({ price, discount }: ApplyDiscountParams) {
  return Math.round(price * (1 - discount));
}

interface GetMaxDiscountRateParams {
  discounts: Discount[];
}

// 최대 할인율
export function getMaxDiscountRate({ discounts }: GetMaxDiscountRateParams) {
  return Math.max(...discounts.map((d) => d.rate));
}
