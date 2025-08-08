import { CartItem, Coupon, Product } from "../../types";
import { multiply } from "../utils/calculators";
import { applyCouponDiscount } from "./coupons";
import { getMaxApplicableDiscount } from "./discount";

export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export const getCartItemByProductId = (
  cart: CartItem[],
  productId: string
): CartItem | undefined => {
  return cart.find((item) => item.product.id === productId);
};

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const baseAmount = multiply(price, quantity);
  const maxDiscountRate = getMaxApplicableDiscount(item, cart);
  const discountedAmount = multiply(baseAmount, 1 - maxDiscountRate);

  return Math.round(discountedAmount);
};

export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): CartTotal => {
  const { beforeDiscount, afterItemDiscounts } = cart.reduce(
    (totals, item) => ({
      beforeDiscount:
        totals.beforeDiscount + multiply(item.product.price, item.quantity),
      afterItemDiscounts:
        totals.afterItemDiscounts + calculateItemTotal(item, cart),
    }),
    { beforeDiscount: 0, afterItemDiscounts: 0 }
  );

  return {
    totalBeforeDiscount: Math.round(beforeDiscount),
    totalAfterDiscount: Math.round(
      applyCouponDiscount(afterItemDiscounts, coupon)
    ),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
) => {
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

export const addItemToCart = (cart: CartItem[], product: Product) => {
  const existingItem = getCartItemByProductId(cart, product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + 1);
  }

  return [...cart, { product, quantity: 1 }];
};

export const removeItemFromCart = (cart: CartItem[], productId: string) => {
  return cart.filter((item) => item.product.id !== productId);
};

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = getCartItemByProductId(cart, product.id);
  const remainingStock = product.stock - (cartItem?.quantity || 0);

  return remainingStock;
};
