import { CartItem, Product } from '../models/entities';

export const getRemainingStock = (
  product: Product,
  cartItem: CartItem
): number => {
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
