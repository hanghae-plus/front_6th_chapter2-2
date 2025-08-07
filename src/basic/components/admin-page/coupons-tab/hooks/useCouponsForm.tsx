import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Coupon, Notify } from '../../../../../types';

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

interface UseCouponsFormParams {
  addCoupon: (params: { newCoupon: Coupon }) => void;
  notify: Notify;
}

export function useCouponsForm({ addCoupon, notify }: UseCouponsFormParams) {
  const defaultValue: CouponForm = {
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  };
  const [couponForm, setCouponForm] = useState(defaultValue);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const clearCouponForm = () => {
    setCouponForm(defaultValue);
  };

  const closeCouponForm = () => {
    clearCouponForm();
    setShowCouponForm(false);
  };

  const updateCouponForm = (updates: Partial<CouponForm>) => {
    setCouponForm((prevForm) => ({ ...prevForm, ...updates }));
  };

  const openCouponForm = () => {
    clearCouponForm();
    setShowCouponForm(true);
  };

  const handleSubmitCouponForm = (e: FormEvent) => {
    e.preventDefault();
    addCoupon({
      newCoupon: couponForm,
    });
    closeCouponForm();
  };

  // Input 핸들러들
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCouponForm({ name: e.target.value });
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCouponForm({ code: e.target.value.toUpperCase() });
  };

  const handleDiscountTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateCouponForm({
      discountType: e.target.value as 'amount' | 'percentage',
    });
  };

  const handleDiscountValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      updateCouponForm({
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleDiscountValueBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const { discountType } = couponForm;

    if (discountType === 'percentage') {
      if (value > 100) {
        notify({
          message: '할인율은 100%를 초과할 수 없습니다',
          type: 'error',
        });
        updateCouponForm({ discountValue: 100 });
      } else if (value < 0) {
        updateCouponForm({ discountValue: 0 });
      }
    } else {
      if (value > 100000) {
        notify({
          message: '할인 금액은 100,000원을 초과할 수 없습니다',
          type: 'error',
        });
        updateCouponForm({ discountValue: 100000 });
      } else if (value < 0) {
        updateCouponForm({ discountValue: 0 });
      }
    }
  };

  // 표시용 값들
  const getDisplayValue = (value: number) =>
    value === 0 ? '' : value.toString();

  const getDiscountLabel = (discountType: 'amount' | 'percentage') =>
    discountType === 'amount' ? '할인 금액' : '할인율(%)';

  const getDiscountPlaceholder = (discountType: 'amount' | 'percentage') =>
    discountType === 'amount' ? '5000' : '10';

  return {
    showCouponForm,
    couponForm,
    updateCouponForm,
    clearCouponForm,
    handleSubmitCouponForm,
    closeCouponForm,
    openCouponForm,
    // Input 핸들러들
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleDiscountValueBlur,
    // 표시용 값들
    getDisplayValue,
    getDiscountLabel,
    getDiscountPlaceholder,
  };
}
