import { useState } from 'react';
import { CouponType } from '@/types';
import { initialCouponFormData } from '../constants/coupon';

export const useCouponForm = (addCoupon: (coupon: CouponType) => void) => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState(initialCouponFormData);

  // 쿠폰 폼 제출 처리
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    // 폼 초기화
    setCouponForm(initialCouponFormData);
    setShowCouponForm(false);
  };

  return {
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleCouponSubmit,
  };
};
