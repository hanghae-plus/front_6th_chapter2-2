import { useState } from 'react';

import type { Coupon } from '../../types';
import { useForm } from '../utils/hooks/useForm';

const initialCouponForm: Coupon = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

interface UseCouponFormProps {
  onAddCoupon: (coupon: Coupon) => void;
}

export function useCouponForm({ onAddCoupon }: UseCouponFormProps) {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponFormData, updateCouponFormData, resetCouponFormData] =
    useForm<Coupon>(initialCouponForm);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCoupon(couponFormData);
    resetCouponFormData();
    handleHideCouponForm();
  };

  const handleShowCouponForm = () => {
    setShowCouponForm(true);
  };

  const handleHideCouponForm = () => {
    setShowCouponForm(false);
  };

  return {
    showCouponForm,
    couponFormData,
    updateCouponFormData,
    handleCouponSubmit,
    handleShowCouponForm,
    handleHideCouponForm,
  };
}
