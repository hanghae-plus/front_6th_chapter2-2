import { useState, useCallback, useEffect } from 'react';

import { Coupon } from '../../types';
import * as couponModel from '../models/coupon';

interface UseCouponsProps {
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export function useCoupons({ addNotification }: UseCouponsProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(couponModel.loadCouponsFromStorage);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    couponModel.saveCouponsToStorage(coupons);
  }, [coupons]);

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      setSelectedCoupon(coupon);
      if (coupon) {
        addNotification(`${coupon.name} 쿠폰이 적용되었습니다.`);
      }
    },
    [addNotification],
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const newCoupons = couponModel.addNewCoupon(coupons, newCoupon);
      setCoupons(newCoupons);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const newCoupons = couponModel.removeCouponByCode(coupons, couponCode);
      setCoupons(newCoupons);

      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [coupons, selectedCoupon, addNotification],
  );

  return {
    coupons,
    selectedCoupon,
    applyCoupon,
    addCoupon,
    deleteCoupon,
  };
}
