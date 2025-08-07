import { useAtom } from 'jotai';

import { Coupon, NotificationCallback } from '../../types';
import { calculateCouponDiscount } from '../models/coupon';
import { addCouponAtom, removeCouponAtom } from '../store/actions';

export function useCoupons() {
  const [, addCouponAction] = useAtom(addCouponAtom);
  const [, removeCouponAction] = useAtom(removeCouponAtom);

  const addCoupon = (newCoupon: Coupon, onNotification?: NotificationCallback) => {
    addCouponAction({
      newCoupon,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const removeCoupon = (couponCode: string, onNotification?: NotificationCallback) => {
    removeCouponAction({
      couponCode,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const getCouponDiscountAmount = (coupon: Coupon, cartTotal: number): number => {
    return calculateCouponDiscount(coupon, cartTotal);
  };

  return {
    addCoupon,
    removeCoupon,
    getCouponDiscountAmount,
  };
}
