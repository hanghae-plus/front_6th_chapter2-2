import { useState } from 'react';
import { Coupon } from '../../../../types';
import { initialCoupons } from '../../../constants/mocks';

export function useCoupons() {
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
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  return {
    coupons,
    selectedCoupon,
    couponForm,
    showCouponForm,

    setCoupons,
    setSelectedCoupon,
    setShowCouponForm,
    setCouponForm,
  };
}
