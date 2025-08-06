import { useState } from "react";
import { CouponWithUI } from "./coupon.types";

export interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

const initialCouponForm: CouponFormData = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

export const useCouponForm = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] =
    useState<CouponFormData>(initialCouponForm);

  const resetCouponForm = () => {
    setCouponForm(initialCouponForm);
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
