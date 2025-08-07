import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Coupon } from '../../../types';
import { initialCoupons } from '../../entities/coupon';

// localStorage와 자동 동기화되는 coupons atom
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// 선택된 쿠폰 atom
export const selectedCouponAtom = atom<Coupon | null>(null);
