import { useState } from "react";

export const useCouponForm = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const resetCouponForm = () => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
  };

  const closeCouponForm = () => {
    setShowCouponForm(false);
    resetCouponForm();
  };

  const openCouponForm = () => {
    setShowCouponForm(true);
  };

  return {
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    resetCouponForm,
    closeCouponForm,
    openCouponForm,
  };
};
