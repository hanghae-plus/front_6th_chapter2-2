import { CartItem } from "../../types";

export const cartItemUtils = {
  /**
   * 장바구니 아이템 원래 가격 계산 (UI 표시용)
   */
  calculateOriginalPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  },
};
