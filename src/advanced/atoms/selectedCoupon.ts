import { atom } from 'jotai';
import { Coupon } from '../../types';

export const selectedCouponAtom = atom<Coupon | null>(null);