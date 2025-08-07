import { atom, useAtom } from 'jotai';

import type { Coupon } from '../../../../types';

const selectedCouponAtom = atom<Coupon | null>(null);

export const useSelectedCoupon = () => {
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  const selectCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const resetSelectedCoupon = () => {
    setSelectedCoupon(null);
  };

  const isValidCoupon = (selectedCoupon: Coupon | null, coupons: Coupon[]) => {
    return coupons.some((coupon) => coupon.code === selectedCoupon?.code);
  };

  return { selectedCoupon, selectCoupon, resetSelectedCoupon, isValidCoupon };
};
