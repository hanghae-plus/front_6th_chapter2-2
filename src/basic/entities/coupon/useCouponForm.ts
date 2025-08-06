import { useState } from "react";

export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  return { couponForm, setCouponForm };
};
