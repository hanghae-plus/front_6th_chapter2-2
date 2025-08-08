import { useAtomValue, useSetAtom } from 'jotai';
import {
  couponsAtom,
  selectedCouponAtom,
  applyCouponAtom,
  addCouponAtom,
  deleteCouponAtom,
} from '../atoms/couponAtoms';

export const useCoupons = () => {
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);
  const applyCoupon = useSetAtom(applyCouponAtom);
  const addCoupon = useSetAtom(addCouponAtom);
  const deleteCoupon = useSetAtom(deleteCouponAtom);

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    addCoupon,
    deleteCoupon,
  };
};
