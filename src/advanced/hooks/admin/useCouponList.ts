import { useState, FormEvent } from 'react';
import { Coupon } from '../../../types';
import {
  formatAddMessage,
  formatErrorMessageCRUD,
  formatExceedErrorMessage,
} from '../../utils/format';
import { useToggle } from '../../../shared/hooks/useToggle';
import { useCoupon } from '../coupon/useCoupon';

type CouponForm = {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export function useCouponList() {
  const { addCoupon } = useCoupon();
  const { isOpen: showCouponForm, toggle: toggleCouponForm } = useToggle(false);

  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  const handleCouponSubmit = (e: FormEvent): { success: boolean; message?: string } => {
    e.preventDefault();

    const discountValidation = validateCouponForm('discountValue', couponForm.discountValue);
    if (!discountValidation.isValid) {
      return { success: false, message: discountValidation.message };
    }

    if (!couponForm.name.trim()) {
      return { success: false, message: '쿠폰명을 입력해주세요.' };
    }

    if (!couponForm.code.trim()) {
      return { success: false, message: '쿠폰 코드를 입력해주세요.' };
    }

    try {
      const newCoupon = couponForm as Coupon;
      addCoupon(newCoupon);
      return { success: true, message: formatAddMessage('쿠폰') };
    } catch (error) {
      return { success: false, message: formatErrorMessageCRUD('쿠폰', '추가') };
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    toggleCouponForm();
  };

  const validateCouponForm = (field: keyof CouponForm, value: any): ValidationResult => {
    if (field === 'discountValue') {
      if (couponForm.discountType === 'percentage') {
        if (value > 100) {
          return { isValid: false, message: '할인율은 100%를 초과할 수 없습니다' };
        }
      } else {
        if (value > 100000) {
          return { isValid: false, message: formatExceedErrorMessage('할인 금액', 100000) };
        }
      }
      if (value < 0) {
        return { isValid: false, message: '할인값은 0 이상이어야 합니다.' };
      }
    }
    return { isValid: true };
  };

  // 핸들러
  const handleCouponFormChange = (updates: Partial<CouponForm>) => {
    setCouponForm((prev) => ({ ...prev, ...updates }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    const result = handleCouponSubmit(e);
    if (result.success) {
      resetCouponForm();
    }
    return result;
  };

  return {
    showCouponForm,
    toggleCouponForm,
    couponForm,
    resetCouponForm,

    handleCouponSubmit,
    handleCouponFormChange,
    handleFormSubmit,

    validateCouponForm,
  };
}
