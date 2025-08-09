import { CartItem, Coupon, Product } from "../../types";
import {
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_ADDITIONAL_DISCOUNT,
  MAX_DISCOUNT_RATE,
} from "../constants/cart";

export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some(
    (cartItem) => cartItem.quantity >= BULK_PURCHASE_THRESHOLD
  );
  if (hasBulkPurchase) {
    return Math.min(
      baseDiscount + BULK_PURCHASE_ADDITIONAL_DISCOUNT,
      MAX_DISCOUNT_RATE
    );
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

  return Math.round(price * quantity * (1 - discount));
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotal => {
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

export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const usedQuantity = cartItem ? cartItem.quantity : 0;
  return Math.max(0, product.stock - usedQuantity);
};

export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};
