import { useState } from 'react';
import { Coupon } from '../../../types';
import {
  formatAddMessage,
  formatErrorMessageCRUD,
  formatExceedErrorMessage,
} from '../../utils/format';
import { useToggle } from '../../../shared/hooks/useToggle';

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

export function useCouponList({ addCoupon }: { addCoupon: (coupon: Coupon) => void }) {
  const { isOpen: showCouponForm, toggle: toggleCouponForm } = useToggle(false);

  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  const handleCouponSubmit = (e: React.FormEvent): { success: boolean; message?: string } => {
    e.preventDefault();

    // Validate coupon form before submit
    const discountValidation = validateCouponForm('discountValue', couponForm.discountValue);
    if (!discountValidation.isValid) {
      return { success: false, message: discountValidation.message };
    }

    // Check required fields
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

  // Form update helpers
  const handleCouponFormChange = (updates: Partial<CouponForm>) => {
    setCouponForm((prev) => ({ ...prev, ...updates }));
  };

  return {
    // Coupon form state
    showCouponForm,
    toggleCouponForm,
    couponForm,
    resetCouponForm,

    // Coupon form handlers
    handleCouponSubmit,
    handleCouponFormChange,

    // Validation
    validateCouponForm,
  };
}
