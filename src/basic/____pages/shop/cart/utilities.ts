import { CartItem } from "../../../../types";

export const getMaxApplicableDiscount = (
  item: CartItem,
  hasBulkPurchase: boolean
): number => {
  const base = Math.max(
    0,
    ...item.product.discounts
      .filter((d) => item.quantity >= d.quantity)
      .map((d) => d.rate)
  );

  return hasBulkPurchase ? Math.min(base + 0.05, 0.5) : base;
};

export const calculateTotalPrice = (
  item: CartItem,
  hasBulkPurchase: boolean
) => {
  const discount = getMaxApplicableDiscount(item, hasBulkPurchase);

  return Math.round(item.product.price * item.quantity * (1 - discount));
};

export const calculateDiscountRate = (
  originalPrice: number,
  totalPrice: number
) => {
  return Math.round((1 - totalPrice / originalPrice) * 100);
};
