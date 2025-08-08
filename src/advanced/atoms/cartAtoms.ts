import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { selectedCouponAtom } from './couponsAtoms';
import { CartItem } from '../../types';
import { calculateCartTotal } from '../models/cart';

export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const totalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});
