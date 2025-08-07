import { atomWithStorage } from 'jotai/utils';
import { Coupon } from '../../shared/types';
import { atom } from 'jotai';
import {
  ADD_COUPON,
  DELETE_COUPON,
  initialCoupons,
} from '../../shared/constants';

type CouponAction =
  | { type: typeof ADD_COUPON; payload: { coupon: Coupon } }
  | { type: typeof DELETE_COUPON; payload: { couponCode: string } };

const couponReducer = (state: Coupon[], action: CouponAction) => {
  switch (action.type) {
    // 쿠폰 추가
    case ADD_COUPON:
      return [...state, action.payload.coupon];

    // 쿠폰 삭제
    case DELETE_COUPON:
      return state.filter(coupon => coupon.code !== action.payload.couponCode);

    default:
      return state;
  }
};

const couponsStorageAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

export const couponsAtom = atom(
  get => get(couponsStorageAtom),
  (get, set, action: CouponAction) => {
    const newState = couponReducer(get(couponsStorageAtom), action);
    set(couponsStorageAtom, newState);
  }
);

export const selectedCouponAtom = atom<Coupon | null>(null);
