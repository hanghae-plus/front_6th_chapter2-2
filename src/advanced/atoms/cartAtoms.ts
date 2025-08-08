import { atom } from 'jotai';

import { selectedCouponAtom } from './couponsAtoms';
import { CartItem } from '../../types';
import { calculateCartTotal } from '../models/cart';
import { atomWithLocalStorage } from '../utils/atom';

export const cartAtom = atomWithLocalStorage<CartItem[]>('cart', []);

export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const totalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});
