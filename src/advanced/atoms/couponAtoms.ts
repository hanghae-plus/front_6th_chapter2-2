import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Coupon, CouponForm } from '../types';

// 초기 쿠폰 데이터
const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// localStorage와 동기화되는 coupons atom
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// 쿠폰 추가 액션
export const addCouponAtom = atom(null, (get, set, couponForm: CouponForm) => {
  const currentCoupons = get(couponsAtom);
  const newCoupon: Coupon = {
    ...couponForm,
  };
  set(couponsAtom, [...currentCoupons, newCoupon]);
});

// 쿠폰 삭제 액션
export const deleteCouponAtom = atom(null, (get, set, code: string) => {
  const currentCoupons = get(couponsAtom);
  const filteredCoupons = currentCoupons.filter((coupon) => coupon.code !== code);
  set(couponsAtom, filteredCoupons);
});
