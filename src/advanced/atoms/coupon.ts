import { atom } from 'jotai';
import type { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import * as cartModel from '../models/cart';
import * as couponModel from '../models/coupon';
import { cartAtom } from './cart';

export const couponsAtom = atom<Coupon[]>(initialCoupons);

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

export const selectedCouponAtom = atom<Coupon | null>(null);

export const applyCouponAtom = atom(
  null,
  (get, set, { coupon }: { coupon: Coupon }) => {
    const selectedCoupon = get(selectedCouponAtom);
    const cart = get(cartAtom);

    const { totalAfterDiscount } = cartModel.calculateCartTotal({
      cart,
      applyCoupon: couponModel.getCouponApplier({ coupon }),
    });
    const result = couponModel.applyCoupon({
      coupon,
      prevCoupon: selectedCoupon,
      cartTotal: totalAfterDiscount,
    });

    if (result.success) {
      set(selectedCouponAtom, result.selectedCoupon);
    }

    return result;
  }
);
