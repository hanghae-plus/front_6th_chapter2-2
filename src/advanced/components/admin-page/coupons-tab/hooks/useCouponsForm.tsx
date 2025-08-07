import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useAddCoupon } from '../../../../hooks/useCoupons';
import { useNotify } from '../../../../hooks/useNotification';
import { useCouponFormValidation } from '../../../../utils/hooks/useValidate';

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

export function useCouponsForm() {
  const notify = useNotify();
  const addCoupon = useAddCoupon();
  const { validateDiscountValue, validateCode, displayValues } =
    useCouponFormValidation();

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
    updateCouponForm({ code: validateCode.normalizeCode(e.target.value) });
  };

  const handleDiscountTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateCouponForm({
      discountType: e.target.value as 'amount' | 'percentage',
    });
  };

  const handleDiscountValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateDiscountValue.validateDiscountInput(value)) {
      updateCouponForm({
        discountValue: validateDiscountValue.normalizeDiscountValue(value),
      });
    }
  };

  const handleDiscountValueBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const { discountType } = couponForm;

    const result = validateDiscountValue.normalizeDiscountValueWithLimits(
      value,
      discountType
    );

    updateCouponForm({ discountValue: result.normalizedValue });

    if (result.errorMessage) {
      notify({
        message: result.errorMessage,
        type: 'error',
      });
    }
  };

  // 표시용 값들
  const getDisplayValue = ({ value }: { value: number }) =>
    displayValues.getDisplayValue(value);

  const getDiscountLabel = ({
    discountType,
  }: {
    discountType: 'amount' | 'percentage';
  }) => (discountType === 'amount' ? '할인 금액' : '할인율(%)');

  const getDiscountPlaceholder = ({
    discountType,
  }: {
    discountType: 'amount' | 'percentage';
  }) => (discountType === 'amount' ? '5000' : '10');

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
