import { CartItem, Coupon } from "../../types";
import { CartTotals } from "../types";
import { applyCouponDiscount } from "./coupon";
import { getMaxApplicableDiscount } from "./discount";

// 개별 아이템의 할인 적용 후 총액 계산
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  const finalPrice = price * quantity * (1 - discount);

  return Math.round(finalPrice);
};

// 장바구니 총액 계산 (할인 전/후, 할인액)
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotals => {
  if (!cart.length) {
    return {
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
    };
  }

  const totals = cart.reduce(
    (acc, item) => {
      const itemPrice = item.product.price * item.quantity;
      const itemTotal = calculateItemTotal(item, cart);

      return {
        totalBeforeDiscount: acc.totalBeforeDiscount + itemPrice,
        totalAfterDiscount: acc.totalAfterDiscount + itemTotal,
      };
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );

  const finalTotalAfterDiscount = selectedCoupon
    ? applyCouponDiscount(totals.totalAfterDiscount, selectedCoupon)
    : totals.totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totals.totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotalAfterDiscount),
  };
};

// 수량 변경
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
}
