// src/basic/hooks/useCoupons.ts
import { useAtom } from 'jotai';
import { couponsAtom } from '../store/atoms';
import { Coupon } from '../types';

export const useCoupons = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);

  const addCoupon = (newCoupon: Coupon) => {
    // Prevent adding duplicate coupon codes
    if (coupons.some(c => c.code === newCoupon.code)) {
      // In a real app, you might want to show a toast notification
      console.error("Coupon code already exists.");
      return;
    }
    setCoupons(prev => [...prev, newCoupon]);
  };

  const removeCoupon = (couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
  };

  return { coupons, addCoupon, removeCoupon };
};

