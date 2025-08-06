import { initialCoupons } from '@/basic/constants/mocks';
import { useLocalStorage } from '@/basic/hooks';
import { Coupon } from '@/types';
import { useState } from 'react';

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
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
