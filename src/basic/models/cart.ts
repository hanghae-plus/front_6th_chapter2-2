import { CartItem, Coupon, Product } from "../../types";
import { applyCouponDiscount } from "./coupons";
import { getMaxApplicableDiscount } from "./discount";

export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  const subtotal = price * quantity;
  const discountedAmount = subtotal * (1 - discount);

  return Math.round(discountedAmount);
};

export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): CartTotal => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const totalAfterDiscount = applyCouponDiscount(
    cart.reduce((total, item) => {
      return total + calculateItemTotal(item, cart);
    }, 0),
    coupon
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
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
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + 1);
  }

  return [...cart, { product, quantity: 1 }];
};

export const removeItemFromCart = (cart: CartItem[], productId: string) => {
  return cart.filter((item) => item.product.id !== productId);
};

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remainingStock = product.stock - (cartItem?.quantity || 0);

  return remainingStock;
};
