import { useState, useCallback } from 'react';
import type { Coupon as CouponType, CouponFormData as CouponFormDataType } from '../../types';
import {
  normalizeCode,
  updateFormDiscountType,
  parseDiscountValue,
  validateDiscountValue as validateDiscountValuePure,
  formToCoupon,
  resetCouponForm,
} from '../models/couponForm';
import { DEFAULT_COUPON_FORM } from '../constants/couponForm';

/**
 * 쿠폰 폼 상태와 핸들러를 관리하는 커스텀 훅
 * @returns 쿠폰 폼 데이터와 핸들러 함수들
 */
export function useCouponForm() {
  const [couponForm, setCouponForm] = useState<CouponFormDataType>(DEFAULT_COUPON_FORM);

  /**
   * 쿠폰 이름 업데이트
   * @param name - 쿠폰 이름
   */
  const updateName = useCallback((name: string) => {
    setCouponForm((prev) => ({ ...prev, name }));
  }, []);

  /**
   * 쿠폰 코드 업데이트
   * @param code - 쿠폰 코드
   */
  const updateCode = useCallback((code: string) => {
    setCouponForm((prev) => ({ ...prev, code: normalizeCode(code) }));
  }, []);

  /**
   * 할인 타입 업데이트
   * @param discountType - 할인 타입
   */
  const updateDiscountType = useCallback((discountType: 'amount' | 'percentage') => {
    setCouponForm((prev) => updateFormDiscountType(prev, discountType));
  }, []);

  /**
   * 할인 값 입력 처리 (숫자 입력 검증)
   * @param value - 할인 값
   */
  const updateDiscountValue = useCallback((value: string) => {
    const parsedValue = parseDiscountValue(value);
    if (parsedValue !== null) {
      setCouponForm((prev) => ({ ...prev, discountValue: parsedValue }));
    }
  }, []);

  /**
   * 할인 값 유효성 검증 (onBlur 시 호출)
   * @param value - 할인 값
   * @param onError - 유효성 검증 실패 시 호출되는 콜백
   */
  const validateDiscountValue = useCallback(
    (value: string, onError: (message: string) => void) => {
      const numericValue = parseInt(value) || 0;
      const validation = validateDiscountValuePure(numericValue, couponForm.discountType);

      // 유효성 검증 실패 시 콜백 호출
      if (!validation.isValid) {
        onError(validation.message);
      }

      setCouponForm((prev) => ({ ...prev, discountValue: validation.correctedValue }));
    },
    [couponForm.discountType],
  );

  /**
   * 쿠폰 폼 제출 처리
   * @param e - 이벤트
   * @param onSubmit - 쿠폰 제출 콜백
   * @param onClose - 폼 닫기 콜백
   */
  const submitForm = useCallback(
    (e: React.FormEvent, onSubmit: (coupon: CouponType) => void, onClose: () => void) => {
      e.preventDefault();
      onSubmit(formToCoupon(couponForm));
      setCouponForm(resetCouponForm());
      onClose();
    },
    [couponForm],
  );

  /**
   * 쿠폰 폼 초기화
   */
  const resetForm = useCallback(() => {
    setCouponForm(resetCouponForm());
  }, []);

  /**
   * 쿠폰 폼 변경 핸들러
   * @param form - 변경된 쿠폰 폼 데이터
   */
  const handleCouponFormChange = (form: CouponFormDataType) => setCouponForm(form);

  return {
    couponForm,
    updateName,
    updateCode,
    updateDiscountType,
    updateDiscountValue,
    validateDiscountValue,
    submitForm,
    resetForm,
    handleCouponFormChange,
  };
}
