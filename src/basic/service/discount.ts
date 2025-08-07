import { CartItem, Discount } from "../../types";
import {
  BULK_PURCHASE_ADDITIONAL_DISCOUNT_RATE,
  BULK_PURCHASE_QUANTITY,
  MAX_DISCOUNT_RATE,
} from "../constants/discount";

// 상품의 기본 할인율
const calculateBaseDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount: number, discount: Discount) => {
    const isEligible = quantity >= discount.quantity;
    const hasHigherRate = discount.rate > maxDiscount;

    return isEligible && hasHigherRate ? discount.rate : maxDiscount;
  }, 0);
};

// 적용 가능한 최대 할인율 계산
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = calculateBaseDiscount(item);
  const bulkBonus = calculateBulkPurchaseBonus(cart);
  const totalDiscount = baseDiscount + bulkBonus;

  return Math.min(totalDiscount, MAX_DISCOUNT_RATE);
};

// 대량 구매 할인
const calculateBulkPurchaseBonus = (cart: CartItem[]): number => {
  const hasBulkPurchase = cart.some(
    (cartItem) => cartItem.quantity >= BULK_PURCHASE_QUANTITY
  );

  return hasBulkPurchase ? BULK_PURCHASE_ADDITIONAL_DISCOUNT_RATE : 0;
};
