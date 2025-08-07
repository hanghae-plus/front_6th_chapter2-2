import { type CartItem as CartItemType } from "@/types";
import { sumBy } from "@shared/libs/calculation";
import { calculateItemTotal } from "./item";

/**
 * 장바구니 소계 계산 (할인 미적용)
 */
export const getCartSubtotal = (cart: CartItemType[]): number => {
  return Math.round(sumBy(cart, (item) => item.product.price * item.quantity));
};

/**
 * 장바구니 총액 계산 (할인 적용)
 */
export const getCartTotalWithDiscounts = (cart: CartItemType[]): number => {
  return Math.round(sumBy(cart, (item) => calculateItemTotal(item, cart)));
};
