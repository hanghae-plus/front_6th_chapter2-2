import { CartItem } from "../types";
import {
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_BONUS,
  MAX_DISCOUNT_RATE,
} from "../constants/business";

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

export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
}
