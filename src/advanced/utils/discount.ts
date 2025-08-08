import { CartItem } from '../../types';
import { Discount } from '../../types';
export function getBaseDiscount(discounts: Discount[], quantity: number) {
  return discounts.reduce((max, d) => (quantity >= d.quantity && d.rate > max ? d.rate : max), 0);
}

// 대량구매 보너스 적용 (순수)
export function applyBulkBonus(base: number, hasBulkPurchase: boolean) {
  return hasBulkPurchase ? Math.min(base + 0.05, 0.5) : base;
}

// 최종 할인 (순수) - 외부 상태(cart) 대신 hasBulkPurchase를 인자로 받음
export function getMaxApplicableDiscount(item: CartItem, hasBulkPurchase: boolean) {
  const base = getBaseDiscount(item.product.discounts, item.quantity);
  return applyBulkBonus(base, hasBulkPurchase);
}
