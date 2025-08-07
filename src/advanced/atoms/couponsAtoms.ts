import { atom } from 'jotai';

import { initialCoupons } from '../constants';
import { Coupon } from '../types';

export const couponsAtom = atom<Coupon[]>(initialCoupons);

export const selectedCouponAtom = atom<Coupon | null>(null);
