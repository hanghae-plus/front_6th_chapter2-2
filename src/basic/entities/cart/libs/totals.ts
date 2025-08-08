import { type Cart } from "@entities/cart/types";
import { sumBy } from "@shared/libs/calculation";
import { calculateItemTotal } from "./item";

/**
 * 장바구니 소계 계산 (할인 미적용)
 */
export const getCartSubtotal = (carts: Cart[]): number => {
  return Math.round(sumBy(carts, (item) => item.price * item.quantity));
};

/**
 * 장바구니 총액 계산 (할인 적용)
 */
export const getCartTotalWithDiscounts = (carts: Cart[]): number => {
  return Math.round(sumBy(carts, (item) => calculateItemTotal(item, carts)));
};
