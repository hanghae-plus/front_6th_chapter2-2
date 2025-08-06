import { CartItem } from "@/basic/features/cart/types/cart.type";
import { couponModel } from "@/basic/features/coupon/models/coupon.model";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { discountModel } from "@/basic/features/discount/models/discount.model";
import { Product } from "@/basic/features/product/types/product";
import { calculateDiscountedPrice } from "@/basic/shared/utils/calculation.util";

const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const maxDiscountRate = discountModel.getMaxApplicableDiscountRate(
    item,
    cart
  );
  const itemTotal = item.product.price * item.quantity;

  return calculateDiscountedPrice(itemTotal, maxDiscountRate);
};

interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotal => {
  const totalBeforeDiscount = calculateCartOriginalTotal(cart);

  const totalAfterItemDiscounts = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item, cart),
    0
  );

  const totalAfterCouponDiscount = selectedCoupon
    ? couponModel.applyCouponDiscount(totalAfterItemDiscounts, selectedCoupon)
    : totalAfterItemDiscounts;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCouponDiscount),
  };
};

const calculateCartOriginalTotal = (cart: CartItem[]): number => {
  return cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
};

const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

export const cartModel = {
  calculateItemTotal,
  calculateCartTotal,
  calculateCartOriginalTotal,
  getRemainingStock,
};
