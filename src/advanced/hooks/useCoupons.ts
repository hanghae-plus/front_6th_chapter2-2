import { useAtom, useSetAtom } from 'jotai';
import { useState, useCallback } from 'react';

import { Coupon } from '../../types';
import { addNotificationAtom, couponsAtom, selectedCouponAtom } from '../atoms';
import { initialCouponForm } from '../constants';
import * as couponModel from '../models/coupon';

export function useCoupons() {
  const addNotification = useSetAtom(addNotificationAtom);

  const [coupons, setCoupons] = useAtom(couponsAtom);

  const [couponForm, setCouponForm] = useState(initialCouponForm);

  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      setSelectedCoupon(coupon);
      if (coupon) {
        addNotification({ message: `${coupon.name} 쿠폰이 적용되었습니다.` });
      }
    },
    [addNotification],
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const newCoupons = couponModel.addNewCoupon(coupons, newCoupon);
      setCoupons(newCoupons);
      addNotification({ message: '쿠폰이 추가되었습니다.', type: 'success' });
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
      addNotification({ message: '쿠폰이 삭제되었습니다.', type: 'success' });
    },
    [coupons, selectedCoupon, addNotification],
  );

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  return {
    coupons,
    selectedCoupon,
    applyCoupon,
    addCoupon,
    deleteCoupon,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleCouponSubmit,
  };
}
