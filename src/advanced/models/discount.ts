import { CartItem } from "../types";
import {
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_BONUS,
  MAX_DISCOUNT_RATE,
} from "../constants/business";

// 개별 아이템에 적용 가능한 최대 할인율 계산
export function getMaxApplicableDiscount(
  item: CartItem,
  cart: CartItem[]
): number {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some(
    (cartItem) => cartItem.quantity >= BULK_PURCHASE_THRESHOLD
  );
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + BULK_PURCHASE_BONUS, MAX_DISCOUNT_RATE);
  }

  return baseDiscount;
}