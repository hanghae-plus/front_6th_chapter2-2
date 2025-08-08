import { type FormEvent, useState } from "react";

import { useCouponAtom } from "./useCouponAtom";

type CouponFormType = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

export function useCouponForm() {
  const { handleCouponSubmit } = useCouponAtom();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponFormType>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCouponSubmit(couponForm, resetForm, setShowCouponForm);
  };

  const resetForm = () => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0
    });
  };

  const handleToggleForm = () => {
    setShowCouponForm(!showCouponForm);
  };

  const handleCancel = () => {
    setShowCouponForm(false);
  };

  return {
    // 상태
    couponForm,
    showCouponForm,

    // 액션
    setCouponForm,
    handleSubmit,
    handleToggleForm,
    handleCancel
  };
}
