import { useState, useCallback } from "react";

export type CouponFormState = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

const defaultCouponForm: CouponFormState = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

export function useCouponForm(initial?: Partial<CouponFormState>) {
  const [couponForm, setCouponForm] = useState<CouponFormState>({
    ...defaultCouponForm,
    ...initial,
  });

  const resetCouponForm = useCallback(() => {
    setCouponForm(defaultCouponForm);
  }, []);

  return {
    couponForm,
    setCouponForm,
    resetCouponForm,
  };
}
