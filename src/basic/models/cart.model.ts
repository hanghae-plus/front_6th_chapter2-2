import { applyCouponDiscount } from "@/basic/models/coupon.model";
import { getMaxApplicableDiscountRate } from "@/basic/models/discount.model";
import { calculateDiscountedPrice } from "@/basic/utils/calculation.util";
import { CartItem, Coupon, Product } from "@/types";

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const maxDiscountRate = getMaxApplicableDiscountRate(item, cart);
  const itemTotal = item.product.price * item.quantity;

  return calculateDiscountedPrice(itemTotal, maxDiscountRate);
};

export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotal => {
  const totalBeforeDiscount = calculateCartOriginalTotal(cart);

  const totalAfterItemDiscounts = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item, cart),
    0
  );

  const totalAfterCouponDiscount = selectedCoupon
    ? applyCouponDiscount(totalAfterItemDiscounts, selectedCoupon)
    : totalAfterItemDiscounts;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCouponDiscount),
  };
};

export const calculateCartOriginalTotal = (cart: CartItem[]): number => {
  return cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
};

export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
