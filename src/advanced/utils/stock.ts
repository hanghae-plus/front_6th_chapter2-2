import type { CartItem, Product } from '../../types';

export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((i) => i.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
