import { CartItem } from "../../types";
import discountModel from "../models/discount";

const discountService = {
  /**
   * 개별 아이템의 할인 적용 후 총액 계산
   * @param item - 아이템 정보
   * @param cart - 장바구니 정보 (대량 구매 할인 계산용)
   * @returns 할인 적용 후 총액
   */
  calculateItemTotal({
    item,
    cart,
  }: {
    item: CartItem;
    cart: CartItem[];
  }): number {
    const quantityDiscount = discountModel.calculateQuantityDiscount({
      discounts: item.product.discounts,
      quantity: item.quantity,
    });

    const discount = discountModel.calculateBulkDiscount({
      carts: cart,
      baseDiscount: quantityDiscount,
    });

    return Math.round(item.product.price * item.quantity * (1 - discount));
  },
};

export default discountService;
