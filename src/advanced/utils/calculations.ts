import { CartItem, Coupon } from "../../types";

// 쿠폰 할인 계산 (순수 함수)
export const calculateCouponDiscount = (amount: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  } else {
    return Math.round(amount * (1 - coupon.discountValue / 100));
  }
};

// 쿠폰이 적용된 최종 총액 계산
export const calculateFinalTotal = (
  cartTotal: { totalBeforeDiscount: number; totalAfterDiscount: number },
  selectedCoupon: Coupon | null
): { totalBeforeDiscount: number; totalAfterDiscount: number } => {
  if (!selectedCoupon) {
    return cartTotal;
  }

  const finalTotal = calculateCouponDiscount(cartTotal.totalAfterDiscount, selectedCoupon);

  return {
    ...cartTotal,
    totalAfterDiscount: finalTotal,
  };
};

// 장바구니 총액 계산 (순수 함수)
export const calculateCartTotalAmount = (
  cart: CartItem[],
  calculateItemTotal: (item: CartItem) => number
): { totalBeforeDiscount: number; totalAfterDiscount: number } => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item);
  });

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

// 장바구니 총 아이템 개수 계산 (순수 함수)
export const calculateTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// 장바구니와 쿠폰을 조합한 최종 총액 계산
export const getFinalTotalWithCoupon = (
  calculateCartTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number },
  selectedCoupon: Coupon | null
): { totalBeforeDiscount: number; totalAfterDiscount: number } => {
  const cartTotals = calculateCartTotal();
  return calculateFinalTotal(cartTotals, selectedCoupon);
};

// 아이템별 할인 정보 계산
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
