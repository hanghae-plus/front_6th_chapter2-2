import { CartItem } from '@/types';

const getMaxApplicableDiscount = (item: CartItem, hasBulkPurchase: boolean): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

export const calculateItemTotal = (item: CartItem, hasBulkPurchase: boolean): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, hasBulkPurchase);

  return Math.round(price * quantity * (1 - discount));
};
