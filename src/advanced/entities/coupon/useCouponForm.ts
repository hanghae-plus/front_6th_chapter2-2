import { useCallback } from "react";
import { useAtom } from "jotai";

import { showCouponFormAtom, couponFormAtom } from "../../atoms";

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
  const [showCouponForm, setShowCouponForm] = useAtom(showCouponFormAtom);
  const [couponForm, setCouponForm] = useAtom(couponFormAtom);

  const updateField = useCallback(
    (field: keyof CouponFormData, value: any) => {
      setCouponForm((prev) => ({ ...prev, [field]: value }));
    },
    [setCouponForm]
  );

  const resetCouponForm = useCallback(() => {
    setCouponForm(initialCouponForm);
  }, [setCouponForm]);

  const closeCouponForm = useCallback(() => {
    setShowCouponForm(false);
    resetCouponForm();
  }, [setShowCouponForm, resetCouponForm]);

  const openCouponForm = useCallback(() => {
    setShowCouponForm(true);
  }, [setShowCouponForm]);

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
