import { CartItem } from "@/basic/features/cart/types/cart.type";
import { DISCOUNT } from "@/basic/features/discount/constants/discount";

const getMaxApplicableDiscountRate = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const maxApplicableDiscountRate = discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((max, discount) => Math.max(max, discount.rate), 0);

  const hasBulkPurchase = cart.some(
    (cartItem) => cartItem.quantity >= DISCOUNT.BULK_PURCHASE_THRESHOLD
  );

  if (hasBulkPurchase) {
    const totalDiscount =
      maxApplicableDiscountRate + DISCOUNT.BULK_PURCHASE_BONUS_RATE;

    return Math.min(totalDiscount, DISCOUNT.MAX_DISCOUNT_RATE);
  }

  return maxApplicableDiscountRate;
};

export const discountModel = {
  getMaxApplicableDiscountRate,
};
