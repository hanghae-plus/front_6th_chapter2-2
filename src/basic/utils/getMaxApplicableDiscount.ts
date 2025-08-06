import { CartItem } from "../../types";
import { DISCOUNT } from "../constants";

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some(
    (cartItem) => cartItem.quantity >= DISCOUNT.BULK_THRESHOLD
  );
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + DISCOUNT.BULK_BONUS, DISCOUNT.MAX_RATE);
  }

  return baseDiscount;
};
