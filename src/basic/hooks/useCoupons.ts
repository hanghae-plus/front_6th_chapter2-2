import { useCallback } from 'react';

import { Coupon, NotificationCallback } from '../../types';
import { initialCoupons } from '../constants';
import { validateCouponCode, calculateCouponDiscount } from '../models/coupon';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const addCoupon = useCallback(
    (newCoupon: Coupon, onNotification?: NotificationCallback) => {
      if (!validateCouponCode(newCoupon.code, coupons)) {
        onNotification?.('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      onNotification?.('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, setCoupons]
  );

  const removeCoupon = useCallback(
    (couponCode: string, onNotification?: NotificationCallback) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      onNotification?.('쿠폰이 삭제되었습니다.', 'success');
    },
    [setCoupons]
  );

  const getCouponDiscountAmount = useCallback((coupon: Coupon, cartTotal: number): number => {
    return calculateCouponDiscount(coupon, cartTotal);
  }, []);

  return {
    coupons,
    addCoupon,
    removeCoupon,
    getCouponDiscountAmount,
  };
}
