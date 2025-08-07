import { atom } from 'jotai';

import { CartItem, CartItemWithDetail } from '../types';
import { selectedCouponAtom } from './couponsAtoms';
import { productsAtom } from './productsAtoms';
import { calculateCartTotal } from '../models/cart';

export const cartAtom = atom<Omit<CartItem, 'product'>[]>([]);

export const cartWithDetailsAtom = atom((get): CartItemWithDetail[] => {
  const cart = get(cartAtom);
  const products = get(productsAtom);

  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItemWithDetail => item !== null);
});

export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const totalsAtom = atom((get) => {
  const cartWithDetails = get(cartWithDetailsAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cartWithDetails, selectedCoupon);
});
