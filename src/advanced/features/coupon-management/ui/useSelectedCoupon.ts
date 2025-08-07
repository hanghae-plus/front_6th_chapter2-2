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

  return { selectedCoupon, selectCoupon, resetSelectedCoupon };
};
