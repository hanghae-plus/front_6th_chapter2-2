import { atom } from 'jotai';

import { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import { atomWithLocalStorage } from '../utils/atom';

export const couponsAtom = atomWithLocalStorage<Coupon[]>('coupons', initialCoupons);

export const selectedCouponAtom = atom<Coupon | null>(null);
