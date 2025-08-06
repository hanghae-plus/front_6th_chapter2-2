import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Coupon } from '../types';
import { INITIAL_COUPONS } from '../constants';

// 장바구니 아이템들 (localStorage 연동)
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 쿠폰 목록 (localStorage 연동)
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', INITIAL_COUPONS);

// 선택된 쿠폰 (메모리만)
export const selectedCouponAtom = atom<Coupon | null>(null);

// 장바구니 총 아이템 개수 (파생 상태)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});