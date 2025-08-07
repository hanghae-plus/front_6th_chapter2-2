import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { CartItem } from '../../../../types';
import type { ProductWithUI } from '../../product';

export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  set(cartAtom, [...get(cartAtom), { product, quantity: 1 }]);
});

export const updateToCartAtom = atom(
  null,
  (get, set, product: ProductWithUI, newQuantity: number) => {
    set(
      cartAtom,
      get(cartAtom).map((item) =>
        item.product.id === product.id ? { ...item, quantity: newQuantity } : item
      )
    );
  }
);

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  set(
    cartAtom,
    get(cartAtom).filter((item) => item.product.id !== productId)
  );
});

export const resetCartAtom = atom(null, (get, set) => {
  set(cartAtom, []);
});
