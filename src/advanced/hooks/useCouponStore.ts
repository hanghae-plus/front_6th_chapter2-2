import { useCallback } from 'react';

import type { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCouponStore() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prev) => [...prev, newCoupon]);
  }, []);

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  }, []);

  return { coupons, addCoupon, deleteCoupon };
}
