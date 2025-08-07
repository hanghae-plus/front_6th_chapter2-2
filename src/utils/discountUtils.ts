import { CartItemType } from '@/types';

// 기본 할인율 계산 (수령 수량에 따른 할인)
const getBaseDiscount = (item: CartItemType) => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

// 대량 구매 추가 할인 (10개 이상 구매시 5% 추가 할인)
const getBulkPurchaseDiscount = (cart: CartItemType[]): number => {
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

  return hasBulkPurchase ? 0.05 : 0;
};

// 최대 적용 가능한 할인율 계산
export const getMaxApplicableDiscount = (item: CartItemType, cart: CartItemType[]): number => {
  const baseDiscount = getBaseDiscount(item);
  const bulkPurchaseDiscount = getBulkPurchaseDiscount(cart);

  return Math.min(baseDiscount + bulkPurchaseDiscount, 0.5); // 최대 50% 할인
};
