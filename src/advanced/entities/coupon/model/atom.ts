import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Coupon } from '../../../../types';
import { initialCoupons } from '../consts';

export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  set(couponsAtom, [...get(couponsAtom), newCoupon]);
});

export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  set(
    couponsAtom,
    get(couponsAtom).filter((c) => c.code !== couponCode)
  );
});
