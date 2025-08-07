import { useState } from 'react';

import { Coupon } from '../../types';

const useCouponForm = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const handleCouponFormSubmit = () => {
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const updateCouponForm = (form: Partial<Coupon>) => {
    setCouponForm((prev) => ({ ...prev, ...form }));
  };

  const updateShowCouponForm = (show: boolean) => {
    setShowCouponForm(show);
  };

  return {
    couponForm,
    showCouponForm,
    handleCouponFormSubmit,
    updateCouponForm,
    updateShowCouponForm,
  };
};

export { useCouponForm };
