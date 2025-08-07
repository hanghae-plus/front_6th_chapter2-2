import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Coupon } from '../types';
import { initialProducts, initialCoupons, ProductWithUI } from './constants/initialData';

// Products
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);

// Cart
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// Coupons
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// Selected Coupon (not persisted)
export const selectedCouponAtom = atom<Coupon | null>(null);

