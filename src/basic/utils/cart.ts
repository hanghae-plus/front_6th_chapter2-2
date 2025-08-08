import { CartItem } from '../../types';

export const getItemDiscountRate = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

export const getBulkDiscountRate = (cart: CartItem[]): number => {
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  return hasBulkPurchase ? 0.05 : 0;
};

export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;

  const itemDiscount = getItemDiscountRate(item);
  const bulkDiscount = getBulkDiscountRate(cart);

  const totalDiscount = Math.min(itemDiscount + bulkDiscount, 0.5);
  return Math.round(price * quantity * (1 - totalDiscount));
};
