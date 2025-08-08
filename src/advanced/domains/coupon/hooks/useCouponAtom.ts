import { useAtom, useAtomValue } from "jotai";

import { useNotifications } from "../../../shared";
import { calculateCartTotal, cartAtom } from "../../cart";
import { couponApplicationService } from "../services";
import { couponsAtom, selectedCouponAtom } from "../store";
import type { Coupon } from "../types";

export function useCouponAtom() {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const cart = useAtomValue(cartAtom);
  const { addNotification } = useNotifications();

  const deleteCoupon = (couponCode: string) => {
    couponApplicationService.deleteCoupon(
      couponCode,
      selectedCoupon,
      setCoupons,
      setSelectedCoupon,
      addNotification
    );
  };

  const handleCouponSubmit = (
    couponForm: Coupon,
    resetForm: () => void,
    setShowForm: (show: boolean) => void
  ) => {
    couponApplicationService.handleCouponSubmit(
      couponForm,
      coupons,
      setCoupons,
      resetForm,
      setShowForm,
      addNotification
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
    couponApplicationService.applyCoupon(coupon, currentTotal, setSelectedCoupon, addNotification);
  };

  return {
    coupons,
    selectedCoupon,
    deleteCoupon,
    handleCouponSubmit,
    applyCoupon,
    setSelectedCoupon
  };
}
