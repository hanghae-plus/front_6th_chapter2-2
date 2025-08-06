import { useState, useCallback } from "react";
import { CouponFormState, INITIAL_COUPON_FORM } from "../types/admin";
import { Coupon } from "../../types";

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
    // 상태
    couponForm,
    showCouponForm,

    // 상태 설정자
    setCouponForm,
    showForm,
    hideForm,
    handleCouponSubmit,
  };
};
