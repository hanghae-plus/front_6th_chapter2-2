import { CartItem, Coupon } from "../../types";

/**
 * 쿠폰이 적용된 최종 총액 계산
 */
export const calculateFinalTotal = (
  cartTotal: { totalBeforeDiscount: number; totalAfterDiscount: number },
  selectedCoupon: Coupon | null
): { totalBeforeDiscount: number; totalAfterDiscount: number } => {
  if (selectedCoupon) {
    let finalTotal = cartTotal.totalAfterDiscount;

    if (selectedCoupon.discountType === "amount") {
      finalTotal = Math.max(0, finalTotal - selectedCoupon.discountValue);
    } else {
      finalTotal = Math.round(finalTotal * (1 - selectedCoupon.discountValue / 100));
    }

    return {
      ...cartTotal,
      totalAfterDiscount: finalTotal,
    };
  }

  return cartTotal;
};

/**
 * 아이템별 할인 정보 계산
 */
export const calculateItemDiscount = (
  item: CartItem,
  itemTotal: number
): {
  hasDiscount: boolean;
  discountRate: number;
  originalPrice: number;
} => {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return {
    hasDiscount,
    discountRate,
    originalPrice,
  };
};
