import type { Cart } from "@entities/cart/types";
import { Coupon, DiscountType } from "@entities/coupon";
import {
  calculateDiscountedPrice,
  calculateDiscountedAmount,
} from "@shared/libs/price";
import { getCartTotalWithDiscounts, getCartSubtotal } from "./totals";

/**
 * 쿠폰이 적용된 장바구니 총액 계산
 */
export const getCartTotalWithCoupon = (
  cart: Cart[],
  coupon: Coupon
): number => {
  const totalWithDiscounts = getCartTotalWithDiscounts(cart);

  if (coupon.discountType === DiscountType.AMOUNT) {
    return calculateDiscountedAmount(totalWithDiscounts, coupon.discountValue);
  } else {
    return Math.round(
      calculateDiscountedPrice(totalWithDiscounts, coupon.discountValue)
    );
  }
};

/**
 * 장바구니 할인 요약 정보 계산
 */
export const getCartDiscountSummary = (
  cart: Cart[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = getCartSubtotal(cart);
  const totalAfterDiscount = selectedCoupon
    ? getCartTotalWithCoupon(cart, selectedCoupon)
    : getCartTotalWithDiscounts(cart);

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
  };
};
