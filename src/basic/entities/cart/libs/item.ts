import { type Cart } from "@entities/cart/types";
import {
  findMaxDiscountByQuantity,
  calculateBonusDiscount,
  hasItemWithMinQuantity,
  calculateTotalWithDiscount,
} from "./discounts";

const BULK_PURCHASE_THRESHOLD = 10;
const BULK_PURCHASE_BONUS = 0.05;
const MAX_DISCOUNT_RATE = 0.5;

/**
 * 상품별 최대 적용 가능한 할인율 계산
 */
export const getMaxApplicableDiscount = (item: Cart, cart: Cart[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = findMaxDiscountByQuantity(quantity, discounts);
  const hasBulkPurchase = hasItemWithMinQuantity(cart, BULK_PURCHASE_THRESHOLD);

  return calculateBonusDiscount(
    baseDiscount,
    hasBulkPurchase,
    BULK_PURCHASE_BONUS,
    MAX_DISCOUNT_RATE
  );
};

/**
 * 상품별 총액 계산 (할인 적용)
 */
export const calculateItemTotal = (item: Cart, cart: Cart[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return calculateTotalWithDiscount(price, quantity, discount);
};
