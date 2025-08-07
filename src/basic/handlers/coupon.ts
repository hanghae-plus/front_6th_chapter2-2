import { Dispatch, SetStateAction } from "react";
import { Coupon, CouponForm } from "../../types";

export const couponHandler = (
  addCoupon: (newCoupon: Coupon) => void,
  couponForm: CouponForm,
  setCouponForm: Dispatch<SetStateAction<CouponForm>>,
  setShowCouponForm: (value: SetStateAction<boolean>) => void
) => {
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };
  return { handleCouponSubmit };
};
