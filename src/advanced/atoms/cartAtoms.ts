import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { CartItem, Coupon, Product } from '../types';

// localStorage와 동기화되는 cart atom
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 선택된 쿠폰 atom
export const selectedCouponAtom = atom<Coupon | null>(null);

// 장바구니에 상품 추가
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const currentCart = get(cartAtom);
  const existingItem = currentCart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const updatedCart = currentCart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    set(cartAtom, updatedCart);
  } else {
    set(cartAtom, [...currentCart, { product, quantity: 1 }]);
  }
});

// 장바구니에서 상품 제거
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const currentCart = get(cartAtom);
  const filteredCart = currentCart.filter((item) => item.product.id !== productId);
  set(cartAtom, filteredCart);
});

// 수량 업데이트
export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }: { productId: string; quantity: number }) => {
    const currentCart = get(cartAtom);

    if (quantity <= 0) {
      // 수량이 0 이하면 장바구니에서 제거
      const filteredCart = currentCart.filter((item) => item.product.id !== productId);
      set(cartAtom, filteredCart);
    } else {
      const updatedCart = currentCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      set(cartAtom, updatedCart);
    }
  },
);

// 장바구니 비우기
export const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, []);
  set(selectedCouponAtom, null);
});

// 쿠폰 적용
export const applyCouponAtom = atom(null, (get, set, coupon: Coupon | null) => {
  set(selectedCouponAtom, coupon);
});

// 총 아이템 개수 (derived atom)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});
