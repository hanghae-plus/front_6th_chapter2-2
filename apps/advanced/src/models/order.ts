import { calculateItemDiscounts, calculateSubtotal, CartItem } from './cart';
import { calculateCouponDiscount, Coupon } from './coupon';

export type OrderTotal = {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
};

export const calculateCartTotal = (
  cartItems: CartItem[],
  selectedCoupon: Nullable<Coupon>
): OrderTotal => {
  // 1단계: 기본 금액 계산
  const subtotal = calculateSubtotal(cartItems);

  // 2단계: 아이템 할인 계산
  const itemDiscounts = calculateItemDiscounts(cartItems);
  const totalAfterItemDiscounts = subtotal - itemDiscounts;

  // 3단계: 쿠폰 할인 계산
  const couponDiscount = calculateCouponDiscount(
    totalAfterItemDiscounts,
    selectedCoupon
  );

  // 4단계: 최종 금액 계산
  const finalTotal = Math.max(0, totalAfterItemDiscounts - couponDiscount);

  return {
    totalBeforeDiscount: Math.round(subtotal),
    totalAfterDiscount: Math.round(finalTotal)
  };
};

export const generateOrderNumber = () => `ORD-${Date.now()}`;

export const calculateTotalWithCouponDiscount = (
  cartItems: CartItem[],
  selectedCoupon: Coupon
): number => {
  const subtotal = calculateSubtotal(cartItems);
  const itemDiscounts = calculateItemDiscounts(cartItems);
  const totalAfterItemDiscounts = subtotal - itemDiscounts;
  const couponDiscount = calculateCouponDiscount(
    totalAfterItemDiscounts,
    selectedCoupon
  );
  return Math.max(0, totalAfterItemDiscounts - couponDiscount);
};
