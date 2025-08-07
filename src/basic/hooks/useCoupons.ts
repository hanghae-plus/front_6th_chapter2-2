// src/basic/hooks/useCoupons.ts
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { INITIAL_COUPONS } from '../constants';
import { Coupon } from '../types';

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', INITIAL_COUPONS);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [
      ...prevCoupons,
      newCoupon
    ]);
  };

  const removeCoupon = (couponCode: string) => {
    setCoupons(prevCoupons => prevCoupons.filter(c => c.code !== couponCode));
  };

  return { coupons, addCoupon, removeCoupon };
};
