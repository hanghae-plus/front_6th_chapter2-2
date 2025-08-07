import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { initialCoupons } from '../constants';
import { Coupon } from '../types';
import { selectedCouponAtom, applyCouponAtom } from './cartAtoms';
import { addNotificationAtom } from './notificationAtoms';

// localStorage와 동기화되는 coupons atom
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// 쿠폰 추가 액션 (비즈니스 로직 포함)
export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const currentCoupons = get(couponsAtom);

  // 중복 쿠폰 코드 검사
  const existingCoupon = currentCoupons.find((c) => c.code === newCoupon.code);
  if (existingCoupon) {
    set(addNotificationAtom, {
      id: Date.now().toString(),
      message: '이미 존재하는 쿠폰 코드입니다.',
      type: 'error',
    });
    return;
  }

  // 새 쿠폰 추가
  set(couponsAtom, [...currentCoupons, newCoupon]);
  set(addNotificationAtom, {
    id: Date.now().toString(),
    message: '쿠폰이 추가되었습니다.',
    type: 'success',
  });
});

// 쿠폰 삭제 액션 (비즈니스 로직 포함)
export const deleteCouponAtom = atom(null, (get, set, code: string) => {
  const currentCoupons = get(couponsAtom);
  const selectedCoupon = get(selectedCouponAtom);

  // 쿠폰 삭제
  const filteredCoupons = currentCoupons.filter((coupon) => coupon.code !== code);
  set(couponsAtom, filteredCoupons);

  // 삭제된 쿠폰이 현재 선택된 쿠폰이면 선택 해제
  if (selectedCoupon?.code === code) {
    set(applyCouponAtom, null);
  }

  set(addNotificationAtom, {
    id: Date.now().toString(),
    message: '쿠폰이 삭제되었습니다.',
    type: 'success',
  });
});
