import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { addNotificationAtom } from './notificationAtoms';
import { cartAtom } from './cartAtoms';
import { calculateCartTotal } from '../utils/calculators';
import { Coupon, initialCoupons } from '../types';

export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);

export const applyCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);

  const currentTotal = calculateCartTotal(
    cart,
    selectedCoupon
  ).totalAfterDiscount;

  if (currentTotal < 10000 && coupon.discountType === 'percentage') {
    set(
      addNotificationAtom,
      'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
      'error'
    );
    return;
  }

  set(selectedCouponAtom, coupon);
  set(addNotificationAtom, '쿠폰이 적용되었습니다.', 'success');
});

export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const coupons = get(couponsAtom);

  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  if (existingCoupon) {
    set(addNotificationAtom, '이미 존재하는 쿠폰 코드입니다.', 'error');
    return;
  }
  set(couponsAtom, (prev) => [...prev, newCoupon]);
  set(addNotificationAtom, '쿠폰이 추가되었습니다.', 'success');
});

export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  const selectedCoupon = get(selectedCouponAtom);

  set(couponsAtom, (prev) => prev.filter((c) => c.code !== couponCode));
  if (selectedCoupon?.code === couponCode) {
    set(selectedCouponAtom, null);
  }
  set(addNotificationAtom, '쿠폰이 삭제되었습니다.', 'success');
});
