import React, { ChangeEvent, useState } from 'react';
import { Coupon } from '../models/entities';

export const useCouponForm = ({
  addCoupon,
  addNotification,
}: {
  // deleteCoupon: (couponCode: string) => void;
  addCoupon: (newCoupon: Coupon) => void;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}) => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  // const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { value, name } = e.target;
  //   if (value === '' || /^\d+$/.test(value)) {
  //     setCouponForm({
  //       ...couponForm,
  //       [name]: value === '' ? 0 : parseInt(value),
  //     });
  //   }
  // };

  // 할인 타입 변경 핸들러
  const handleDiscountTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'amount' | 'percentage';
    setCouponForm(prev => ({
      ...prev,
      discountType: newType,
      // 타입 변경시 값도 초기화 (금액->퍼센트, 퍼센트->금액 전환시 혼란 방지)
      discountValue: 0,
    }));
  };
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    switch (name) {
      case 'name':
        // 쿠폰명: 일반 텍스트, 특별한 제한 없음
        setCouponForm(prev => ({ ...prev, [name]: value }));
        break;

      case 'code':
        // 쿠폰 코드: 대문자로 변환 + 영숫자만 허용
        const codeValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        setCouponForm(prev => ({ ...prev, code: codeValue }));
        break;

      case 'discountValue':
        // 할인값: 숫자만 허용
        if (value === '' || /^\d+$/.test(value)) {
          setCouponForm(prev => ({
            ...prev,
            discountValue: value === '' ? 0 : parseInt(value),
          }));
        }
        break;

      default:
        setCouponForm(prev => ({ ...prev, [name]: value }));
        break;
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const isPercentage = couponForm.discountType === 'percentage';

    const max = isPercentage ? 100 : 100000;
    const maxMessage = isPercentage
      ? '할인율은 100%를 초과할 수 없습니다'
      : '할인 금액은 100,000원을 초과할 수 없습니다';

    let newValue = Math.max(0, value); // 0보다 작으면 0으로

    if (value > max) {
      addNotification(maxMessage, 'error');
      newValue = max;
    }

    setCouponForm({ ...couponForm, discountValue: newValue });
  };
  // 폼 열기/닫기
  const openForm = () => setShowCouponForm(true);
  const closeForm = () => setShowCouponForm(false);
  return {
    state: {
      showCouponForm,
      couponForm,
    },
    handler: {
      handleBlur,
      handleFieldChange,
      handleCouponSubmit,
      handleDiscountTypeChange,
    },
    actions: {
      openForm,
      closeForm,
    },
  };
};
