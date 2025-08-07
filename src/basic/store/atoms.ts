// src/basic/store/atoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Product, Coupon, CartItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../constants';

// useLocalStorage를 대체하는 atomWithStorage
export const productsAtom = atomWithStorage<Product[]>('products', INITIAL_PRODUCTS);
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', INITIAL_COUPONS);
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// useState를 대체하는 기본 atom
export const selectedCouponAtom = atom<Coupon | null>(null);
export const searchKeywordAtom = atom<string>('');
export const toastMessageAtom = atom<string | null>(null); // Toast 메시지 atom 추가

// 파생된 상태(Derived Atom)
// searchKeywordAtom의 값에 따라 productsAtom을 필터링하여 새로운 상태를 만듭니다.
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const keyword = get(searchKeywordAtom);
  if (!keyword) {
    return products;
  }
  return products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
});
