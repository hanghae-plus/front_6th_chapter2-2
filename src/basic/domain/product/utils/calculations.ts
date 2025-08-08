import { Discount } from "../models";

/**
 * 상품 할인율 계산 (순수 함수)
 */
export const calculateProductDiscount = (
  discounts: Discount[],
  quantity: number
): number => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/**
 * 재고 계산 (순수 함수)
 */
export const calculateRemainingStock = (
  totalStock: number,
  usedStock: number
): number => {
  return totalStock - usedStock;
};
