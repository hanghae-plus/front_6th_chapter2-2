// src/basic/store/atoms.ts
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { Product, Coupon, CartItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../constants';

// localStorage와 JSON.parse를 함께 사용하는 커스텀 storage 생성
// getItem 시점에 파싱 에러가 발생하면, Jotai는 atom의 초기값을 사용하게 됩니다.
const safeJsonStorage = <T>(key: string, initialValue: T) => createJSONStorage<T>(() => ({
  getItem: (key) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      // 값이 없으면 초기값을 사용하도록 undefined 반환
      return undefined;
    }
    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.error('Failed to parse JSON from localStorage', e);
      // 파싱 실패 시 초기값을 사용하도록 undefined 반환
      return undefined;
    }
  },
  setItem: (key, newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
}));


// useLocalStorage를 대체하는 atomWithStorage
export const productsAtom = atomWithStorage<Product[]>('products', INITIAL_PRODUCTS, safeJsonStorage('products', INITIAL_PRODUCTS));
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', INITIAL_COUPONS, safeJsonStorage('coupons', INITIAL_COUPONS));
export const cartAtom = atomWithStorage<CartItem[]>('cart', [], safeJsonStorage('cart', []));

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
