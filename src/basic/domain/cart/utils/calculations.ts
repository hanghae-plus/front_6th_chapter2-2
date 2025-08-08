import { CartItem } from "../models";
import { calculateProductDiscount } from "../../product/utils";
import { calculateRemainingStock } from "../../product/utils";
import { Product } from "../../product/models";
import { Coupon } from "../../coupon/models";

/**
 * 대량 구매 할인 적용 (순수 함수)
 */
export const applyBulkDiscount = (
  baseDiscount: number,
  hasBulkPurchase: boolean
): number => {
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }
  return baseDiscount;
};

/**
 * 아이템 총 가격 계산 (순수 함수)
 */
export const calculateItemPrice = (
  price: number,
  quantity: number,
  discountRate: number
): number => {
  return Math.round(price * quantity * (1 - discountRate));
};

/**
 * 대량 구매 여부 확인 (순수 함수)
 */
export const hasBulkPurchase = (
  cartItems: Array<{ quantity: number }>
): boolean => {
  return cartItems.some((item) => item.quantity >= 10);
};

/**
 * 아이템별 최대 할인율 계산 (순수 함수)
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = calculateProductDiscount(discounts, quantity);
  const hasBulkPurchaseFlag = hasBulkPurchase(cart);

  return applyBulkDiscount(baseDiscount, hasBulkPurchaseFlag);
};

/**
 * 남은 재고 계산 (순수 함수)
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return calculateRemainingStock(product.stock, cartItem?.quantity || 0);
};

/**
 * 아이템별 총액 계산 (순수 함수)
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discountRate = getMaxApplicableDiscount(item, cart);

  return calculateItemPrice(price, quantity, discountRate);
};

/**
 * 장바구니 전체 총액 계산 (순수 함수)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

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
};
