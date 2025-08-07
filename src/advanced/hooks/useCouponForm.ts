import { useState, useCallback } from 'react';
import { Coupon } from '../../types';
import { useNotifications } from '../store/hooks';

interface CouponFormData {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

export const useCouponForm = (coupons: Coupon[], addCoupon: (coupon: Coupon) => void) => {
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0
    });
    setShowForm(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const existingCoupon = coupons.find(c => c.code === formData.code);
      if (existingCoupon) {
        addNotification({ message: '이미 존재하는 쿠폰 코드입니다.', type: 'error' });
        return;
      }

      addCoupon(formData);
      addNotification({ message: '쿠폰이 추가되었습니다.', type: 'success' });
      resetForm();
    },
    [formData, coupons, addCoupon, addNotification, resetForm]
  );

  const updateFormData = useCallback((updates: Partial<CouponFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateDiscountValue = useCallback(
    (value: string) => {
      const numValue = parseInt(value) || 0;

      if (formData.discountType === 'percentage') {
        if (numValue > 100) {
          addNotification({ message: '할인율은 100%를 초과할 수 없습니다', type: 'error' });
          updateFormData({ discountValue: 100 });
        } else if (numValue < 0) {
          updateFormData({ discountValue: 0 });
        }
      } else {
        if (numValue > 100000) {
          addNotification({ message: '할인 금액은 100,000원을 초과할 수 없습니다', type: 'error' });
          updateFormData({ discountValue: 100000 });
        } else if (numValue < 0) {
          updateFormData({ discountValue: 0 });
        }
      }
    },
    [formData.discountType, addNotification, updateFormData]
  );

  return {
    showForm,
    formData,
    setShowForm,
    resetForm,
    handleSubmit,
    updateFormData,
    validateDiscountValue
  };
};
