import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Coupon } from '../../types';
import { initialCoupons } from '../constants';

export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

export const selectedCouponAtom = atom<Coupon | null>(null);
