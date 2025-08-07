import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItemType } from '@/types';

// 장바구니 아이템들 (로컬 스토리지와 연동)
export const cartAtom = atomWithStorage<CartItemType[]>('cart', []);

// 장바구니 총 아이템 수
export const cartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// 장바구니 총 가격
export const cartTotalPriceAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
});
