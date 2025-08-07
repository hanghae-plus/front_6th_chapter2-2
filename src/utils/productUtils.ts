import { CartItemType, ProductType } from '@/types';

// 남은 재고 계산
export const getRemainingStock = (product: ProductType, cart: CartItemType[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
