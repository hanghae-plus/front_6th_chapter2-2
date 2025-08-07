import { CartItem, Coupon, Product } from '../types';

// 상수 정의 - 매직 넘버 제거
const BULK_PURCHASE_THRESHOLD = 10;
const BULK_PURCHASE_BONUS = 0.05;
const MAX_DISCOUNT_RATE = 0.5;

// 유틸리티 함수 - 반복되는 로직 분리
const roundToInteger = (value: number): number => Math.round(value);

// 할인 계산 관련 함수들 - 중간 수준 분리
const calculateBaseDiscount = (discounts: any[], quantity: number): number => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some(cartItem => cartItem.quantity >= BULK_PURCHASE_THRESHOLD);
};

const applyBulkPurchaseDiscount = (baseDiscount: number): number => {
  return Math.min(baseDiscount + BULK_PURCHASE_BONUS, MAX_DISCOUNT_RATE);
};

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = calculateBaseDiscount(
    item.product.discounts,
    item.quantity
  );

  if (hasBulkPurchase(cart)) {
    return applyBulkPurchaseDiscount(baseDiscount);
  }

  return baseDiscount;
};

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return roundToInteger(price * quantity * (1 - discount));
};

// 쿠폰 적용 로직 - 의미 있는 단위로 분리
const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  } else {
    return roundToInteger(total * (1 - coupon.discountValue / 100));
  }
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount(
      totalAfterDiscount,
      selectedCoupon
    );
  }

  return {
    totalBeforeDiscount: roundToInteger(totalBeforeDiscount),
    totalAfterDiscount: roundToInteger(totalAfterDiscount),
  };
};

export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  return product.stock - quantityInCart;
};
