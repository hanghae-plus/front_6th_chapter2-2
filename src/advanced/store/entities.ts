import { atomWithStorage } from 'jotai/utils';

import type { CartItem, Coupon, ProductWithUI } from '../../types';
import { initialCoupons, initialProducts } from '../constants';

// Entity atoms (persisted)
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);
export const selectedCouponAtom = atomWithStorage<Coupon | null>('selectedCoupon', null);
