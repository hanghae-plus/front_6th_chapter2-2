// 쿠폰 폼 상태 관리 Hook
import { useState, useCallback } from "react";
import { CouponFormData, Coupon } from "../type/types";

/**
 * 쿠폰 폼 상태 관리 훅
 *
 * 주요 기능:
 * 1. 폼 데이터 상태 관리
 * 2. 폼 표시/숨김 상태 관리
 * 3. 폼 초기화 및 제출 로직
 */
export function useCouponForm() {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponFormData>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

  // 폼 초기화
  const resetForm = useCallback(() => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  }, []);

  // 새 쿠폰 추가 시작
  const startAddCoupon = useCallback(() => {
    setShowCouponForm(!showCouponForm);
  }, [showCouponForm]);

  // 폼 제출 처리
  const handleSubmit = useCallback(
    (e: React.FormEvent, onAddCoupon: (coupon: Omit<Coupon, "id">) => void) => {
      e.preventDefault();
      onAddCoupon(couponForm);
      resetForm();
    },
    [couponForm, resetForm]
  );

  // 폼 취소 처리
  const handleCancel = useCallback(() => {
    setShowCouponForm(false);
  }, []);

  return {
    // 상태
    showCouponForm,
    couponForm,

    // 액션
    setCouponForm,
    startAddCoupon,
    handleSubmit,
    handleCancel,
    resetForm,
  };
}
