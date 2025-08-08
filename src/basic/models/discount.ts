import { CartItem } from "../../types";

const MAX_BULK_PURCHASE_DISCOUNT = 0.5;
const BULK_PURCHASE_DISCOUNT = 0.05;
const MIN_BULK_PURCHASE_QUANTITY = 10;

// 기본 할인 계산
export const baseDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

// 대량 구매 할인 조건 확인
export const hasBulkPurchaseInCart = (cart: CartItem[]): boolean => {
  return cart.some(
    (item: CartItem) => item.quantity >= MIN_BULK_PURCHASE_QUANTITY
  );
};

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const discount = baseDiscount(item);
  const hasBulkPurchase = hasBulkPurchaseInCart(cart);

  if (hasBulkPurchase) {
    return Math.min(
      discount + BULK_PURCHASE_DISCOUNT,
      MAX_BULK_PURCHASE_DISCOUNT
    );
  }

  return discount;
};
