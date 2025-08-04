// src/basic/hooks/useCoupons.ts
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { INITIAL_COUPONS } from '../constants';
import { Coupon } from '../types';

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', INITIAL_COUPONS);

  const addCoupon = (newCoupon: Omit<Coupon, 'code'>) => {
    setCoupons(prevCoupons => [
      ...prevCoupons,
      {
        ...newCoupon,
        code: newCoupon.name.toUpperCase().replace(/\s/g, '') + Date.now()
      }
    ]);
  };

  const removeCoupon = (couponCode: string) => {
    setCoupons(prevCoupons => prevCoupons.filter(c => c.code !== couponCode));
  };

  return { coupons, addCoupon, removeCoupon };
};
