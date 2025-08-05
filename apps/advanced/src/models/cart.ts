import { z } from 'zod';
import { Product, productSchema } from './product';

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number()
});

export type CartItem = z.infer<typeof cartItemSchema>;

const getMaxApplicableDiscount = (
  item: CartItem,
  cartItems: CartItem[]
): number => {
  const baseDiscount = item.product.discounts.reduce(
    (maxDiscount, discount) => {
      return item.quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    },
    0
  );

  const hasBulkPurchase = cartItems.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

export const calculateItemTotal = (
  cartItem: CartItem,
  cartItems: CartItem[]
): number => {
  const discount = getMaxApplicableDiscount(cartItem, cartItems);

  return Math.round(
    cartItem.product.price * cartItem.quantity * (1 - discount)
  );
};

export const getRemainingStock = (
  product: Product,
  cartItems: CartItem[]
): number => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

export const calculateItemDiscounts = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, cartItem) => {
    const originalPrice = cartItem.product.price * cartItem.quantity;
    const discountedPrice = calculateItemTotal(cartItem, cartItems);
    return total + (originalPrice - discountedPrice);
  }, 0);
};
