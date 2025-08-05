import { CartItem, Product } from '../../../types';

// 상품의 남은 재고 계산
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
