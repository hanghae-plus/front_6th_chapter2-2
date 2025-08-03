import { calculateItemDiscounts, calculateSubtotal, CartItem } from './cart';
import { calculateCouponDiscount, Coupon } from './coupon';

export type OrderTotal = {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Nullable<Coupon>
): OrderTotal => {
  // 1단계: 기본 금액 계산
  const subtotal = calculateSubtotal(cart);

  // 2단계: 아이템 할인 계산
  const itemDiscounts = calculateItemDiscounts(cart);
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
  cart: CartItem[],
  selectedCoupon: Nullable<Coupon>
): number => {
  const subtotal = calculateSubtotal(cart);
  const itemDiscounts = calculateItemDiscounts(cart);
  const totalAfterItemDiscounts = subtotal - itemDiscounts;
  const couponDiscount = calculateCouponDiscount(
    totalAfterItemDiscounts,
    selectedCoupon
  );
  return Math.max(0, totalAfterItemDiscounts - couponDiscount);
};
