import { useState, useCallback } from 'react';
import { CouponForm } from '../types';
/**
 * 쿠폰 폼 상태를 관리하는 커스텀 Hook
 *
 * 관리하는 상태:
 * - couponForm: 쿠폰 폼 데이터
 * - resetCouponForm: 폼 초기화 함수
 *
 * @returns { couponForm, setCouponForm, resetCouponForm }
 */
export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const resetCouponForm = useCallback(() => {
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
  }, []);

  return {
    couponForm,
    setCouponForm,
    resetCouponForm,
  };
};
