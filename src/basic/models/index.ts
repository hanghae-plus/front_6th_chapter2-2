// 여러 모델들을 조합하는 통합 비즈니스 로직만 export

import { CartItem, Coupon } from "../types";
import * as discount from "./discount";
import * as coupon from "./coupon";

// 개별 아이템의 할인 적용 후 총액 계산 (discount + product 조합)
export function calculateItemTotal(
  item: CartItem,
  cart: CartItem[]
): number {
  const { price } = item.product;
  const { quantity } = item;
  const discountRate = discount.getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discountRate));
}

// 장바구니 전체 총액 계산 (discount + coupon 조합)
export function calculateCartTotal(
  cartItems: CartItem[],
  selectedCoupon?: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cartItems.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cartItems);
  });

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
}

// 장바구니에 쿠폰 적용 (cart + coupon 조합)
export function applyCouponToCart(
  cartItems: CartItem[],
  couponToApply: Coupon
): {
  success: boolean;
  reason?: string;
  selectedCoupon?: Coupon;
} {
  // 현재 장바구니 총액 계산 (쿠폰 없이)
  const cartTotal = calculateCartTotal(cartItems, null);
  
  // 쿠폰 사용 가능 여부 검증
  const validation = coupon.validateCouponUsage(couponToApply, cartTotal.totalAfterDiscount);
  
  if (!validation.canUse) {
    return { 
      success: false, 
      reason: validation.reason 
    };
  }
  
  return { 
    success: true, 
    selectedCoupon: couponToApply 
  };
}