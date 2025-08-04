import { CartItem, Coupon } from "../../types";
import { calculateItemTotal } from "./cart";

// 장바구니 총액 계산 (할인 전/후, 할인액)
export function calculateCartTotal(cart: CartItem[], coupon?: Coupon) {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;
  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item);
  });
  if (coupon) {
    if (coupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - coupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - coupon.discountValue / 100)
      );
    }
  }
  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    discount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
}
