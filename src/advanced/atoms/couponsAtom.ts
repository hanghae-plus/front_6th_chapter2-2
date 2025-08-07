import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { Coupon } from '../../types';
import { initialCoupons } from '../data/mockCoupons';

export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons, {
  getItem: (key: string, initialValue: Coupon[]) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  },
  setItem: (key: string, value: Coupon[]) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
});

export const selectedCouponAtom = atom<Coupon | null>(null);
