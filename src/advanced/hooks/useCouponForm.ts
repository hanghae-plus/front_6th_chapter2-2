import { useSetAtom } from 'jotai';
import { useState } from 'react';

import type { Coupon } from '../../types';
import { addNotificationAtom } from '../entities/notification';
import { useForm } from '../shared/hooks';
import { isValidCouponCode } from '../shared/lib';

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
  const addNotification = useSetAtom(addNotificationAtom);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidCouponCode(couponFormData.code)) {
      addNotification('쿠폰 코드는 4-12자 영문 대문자와 숫자만 사용할 수 있습니다.', 'error');
      return;
    }

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
