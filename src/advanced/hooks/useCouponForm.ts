import { useState, useCallback } from "react";
import type { CouponFormState } from "../types/admin";
import type { Coupon } from "../../types";

import { INITIAL_COUPON_FORM } from "../constants/admin";

export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useState<CouponFormState>(INITIAL_COUPON_FORM);
  const [showCouponForm, setShowCouponForm] = useState(false);

  // 쿠폰 폼 표시
  const showForm = useCallback(() => {
    setShowCouponForm(true);
  }, []);

  // 쿠폰 폼 숨김
  const hideForm = useCallback(() => {
    setShowCouponForm(false);
    setCouponForm(INITIAL_COUPON_FORM);
  }, []);

  // 범용 필드 업데이트 함수
  const updateField = useCallback((field: keyof CouponFormState, value: string | number) => {
    setCouponForm((prev) => ({
      ...prev,
      [field]: field === "code" ? String(value).toUpperCase() : value,
    }));
  }, []);

  // 쿠폰 폼 제출 처리 (실제 추가 로직은 외부에서 처리)
  const handleCouponSubmit = useCallback(
    (e: React.FormEvent, onAddCoupon: (coupon: Coupon) => void) => {
      e.preventDefault();

      // 쿠폰 추가
      onAddCoupon(couponForm);

      // 폼 리셋
      hideForm();
    },
    [couponForm, hideForm]
  );

  return {
    couponForm,
    showCouponForm,

    updateField,
    showForm,
    hideForm,
    handleCouponSubmit,
  };
};
