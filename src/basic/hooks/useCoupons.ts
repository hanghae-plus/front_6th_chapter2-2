import { useState, useCallback, useEffect } from 'react';

import { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import { validateCouponCode, calculateCouponDiscount } from '../models/coupon';

export function useCoupons() {
  // coupons 상태 관리 (localStorage 연동)
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

  // coupons localStorage 관리
  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  // addCoupon 함수
  const addCoupon = useCallback(
    (
      newCoupon: Coupon,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
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
  const removeCoupon = useCallback(
    (
      couponCode: string,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void,
      selectedCoupon?: Coupon | null,
      setSelectedCoupon?: (coupon: Coupon | null) => void
    ) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      // 원본 로직: 선택된 쿠폰이 삭제되면 선택 해제
      if (selectedCoupon?.code === couponCode && setSelectedCoupon) {
        setSelectedCoupon(null);
      }
      onNotification?.('쿠폰이 삭제되었습니다.', 'success');
    },
    []
  );

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
