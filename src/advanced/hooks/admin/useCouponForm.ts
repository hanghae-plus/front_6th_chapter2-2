import { useState, useCallback } from "react";
import { Coupon, CouponFormData } from "../../types";
import { INITIAL_COUPON_FORM } from "../../constants";

export function useCouponForm() {
  const [couponForm, setCouponForm] =
    useState<CouponFormData>(INITIAL_COUPON_FORM);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent, onAddCoupon: (coupon: Coupon) => void) => {
      e.preventDefault();
      onAddCoupon(couponForm);
      setCouponForm(INITIAL_COUPON_FORM);
      setShowCouponForm(false);
    },
    [couponForm]
  );

  return {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    handleCouponSubmit,
  };
}
