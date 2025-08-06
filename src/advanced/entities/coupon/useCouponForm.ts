import { useState, useCallback } from "react";
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

  const updateField = useCallback((field: keyof CouponFormData, value: any) => {
    setCouponForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetCouponForm = useCallback(() => {
    setCouponForm(initialCouponForm);
  }, []);

  const closeCouponForm = useCallback(() => {
    setShowCouponForm(false);
    resetCouponForm();
  }, [resetCouponForm]);

  const openCouponForm = useCallback(() => {
    setShowCouponForm(true);
  }, []);

  return {
    showCouponForm,
    setShowCouponForm,
    couponForm,
    updateField,
    resetCouponForm,
    closeCouponForm,
    openCouponForm,
  };
};
