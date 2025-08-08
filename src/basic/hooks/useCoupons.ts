// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useEffect, useState } from 'react';

import { Coupon } from '../../types';
import { initialCoupons } from '../constants';

export function useCoupons() {
  // TODO: 구현
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return initialCoupons;
  });

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (newCoupon: Coupon, onSuccess?: () => void, onException?: () => void) => {
    const existingCoupon = coupons.find((c) => c.code === newCoupon.code);

    if (existingCoupon) {
      onException?.();
      return;
    }

    setCoupons((prev) => [...prev, newCoupon]);
    onSuccess?.();
  };

  const removeCoupon = (couponCode: string, onSuccess?: () => void) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));

    onSuccess?.();
  };

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
