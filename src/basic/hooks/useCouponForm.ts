import { useState } from "react";

export const INITIAL_COUPON_FORM = {
  name: "",
  code: "",
  discountType: "amount" as "amount" | "percentage",
  discountValue: 0,
};

export const useCouponForm = () => {
  /** 쿠폰 등록 폼 표시 상태 */
  const [showCouponForm, setShowCouponForm] = useState(false);

  /** 쿠폰 등록 폼 데이터 */
  const [couponForm, setCouponForm] = useState(INITIAL_COUPON_FORM);

  /** 쿠폰 등록 폼 초기화 */
  const clearCouponForm = () => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
  };

  return {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    clearCouponForm,
  };
};
