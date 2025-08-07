import { useAtom } from 'jotai';

import { Coupon, NotificationCallback } from '../../types';
import { couponsAtom } from '../store/atoms';
import { addCouponAtom, removeCouponAtom } from '../store/actions';
import { calculateCouponDiscount } from '../models/coupon';

export function useCoupons() {
  const [coupons, setCoupons] = useAtom(couponsAtom);

  // Jotai action atoms 사용
  const [, addCouponAction] = useAtom(addCouponAtom);
  const [, removeCouponAction] = useAtom(removeCouponAtom);

  // 기존 인터페이스 유지를 위한 래퍼 함수들
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
    coupons,
    addCoupon,
    removeCoupon,
    getCouponDiscountAmount,
  };
}
