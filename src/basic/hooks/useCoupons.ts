import { useCallback, useState } from 'react';

import { Coupon, NotificationCallback } from '../../types';
import { initialCoupons } from '../constants';
import { validateCouponCode, calculateCouponDiscount } from '../models/coupon';

export function useCoupons() {
  // localStorage에서 초기값 가져오기 (원본 패턴과 동일)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  // addCoupon 함수
  const addCoupon = useCallback(
    (newCoupon: Coupon, onNotification?: NotificationCallback) => {
      if (!validateCouponCode(newCoupon.code, coupons)) {
        onNotification?.('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      onNotification?.('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons]
  );

  // removeCoupon 함수
  const removeCoupon = useCallback((couponCode: string, onNotification?: NotificationCallback) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    onNotification?.('쿠폰이 삭제되었습니다.', 'success');
  }, []);

  // calculateCouponDiscount 활용 함수
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
