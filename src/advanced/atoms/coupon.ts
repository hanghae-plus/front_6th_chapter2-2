import { atom } from 'jotai';
import type { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import * as couponModel from '../models/coupon';

export const couponsAtom = atom<Coupon[]>(initialCoupons);

export const selectedCouponAtom = atom<Coupon | null>(null);

export const addCouponAtom = atom(
  null,
  (get, set, { newCoupon }: { newCoupon: Coupon }) => {
    const coupons = get(couponsAtom);

    const result = couponModel.addCoupon({
      newCoupon,
      coupons,
    });

    if (result.success) {
      set(couponsAtom, result.newCoupons);
    }

    return result;
  }
);

export const deleteCouponAtom = atom(
  null,
  (get, set, { couponCode }: { couponCode: string }) => {
    const coupons = get(couponsAtom);

    const result = couponModel.deleteCoupon({ coupons, couponCode });

    if (result.success) {
      set(couponsAtom, result.newCoupons);
    }

    return result;
  }
);
