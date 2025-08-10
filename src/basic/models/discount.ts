import { CartItem, Discount } from "../../types";
import { VALIDATION_LIMITS } from "../utils/constants";
import { numberUtils } from "../utils/numberUtils";

const discountModel = {
  /**
   * 적용 가능한 최대 할인율 계산
   * @param discounts - 할인 정보
   * @param quantity - 수량
   * @returns 적용 가능한 최대 할인율 (0~0.5)
   */
  calculateQuantityDiscount({
    discounts,
    quantity,
  }: {
    discounts: Discount[];
    quantity: number;
  }): number {
    return discounts.reduce((maxDiscount: number, discount: Discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, VALIDATION_LIMITS.DISCOUNT.MIN_VALUE);
  },

  /**
   * 대량 구매 할인 계산
   * @param carts - 장바구니 정보
   * @param baseDiscount - 기본 할인율
   * @returns 대량 구매 할인율
   */
  calculateBulkDiscount({
    carts,
    baseDiscount,
  }: {
    carts: CartItem[];
    baseDiscount: number;
  }): number {
    const hasBulkPurchase = carts.some(
      (cartItem) =>
        cartItem.quantity >= VALIDATION_LIMITS.CART.BULK_PURCHASE_THRESHOLD
    );
    if (hasBulkPurchase) {
      return numberUtils.findMin([
        baseDiscount + VALIDATION_LIMITS.CART.BULK_PURCHASE_BONUS,
        VALIDATION_LIMITS.CART.MAX_DISCOUNT_RATE,
      ]);
    }

    return baseDiscount;
  },
};

export default discountModel;
