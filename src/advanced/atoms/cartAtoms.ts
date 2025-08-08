import { atom } from 'jotai';

import { selectedCouponAtom } from './couponsAtoms';
import { productsAtom } from './productsAtoms';
import { CartItem } from '../../types';
import { calculateCartTotal } from '../models/cart';

export const cartAtom = atom<CartItem[]>([]);

export const cartWithDetailsAtom = atom((get): CartItem[] => {
  const cart = get(cartAtom);
  const products = get(productsAtom);

  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.product.id);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItem => item !== null);
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
