import { useState, useCallback } from "react";
import { Coupon, CartItem } from "../../types";
import {
  CouponFormData,
  createEmptyCouponForm,
  validateCouponApplication,
  removeCouponFromList,
  addCouponToList,
} from "../models/coupon";
import { calculateCartTotal } from "../models/cart";
import { SUCCESS_MESSAGES } from "../constants/messages";

interface UseCouponsProps {
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  cart?: CartItem[];
}

/**
 * 쿠폰 관리를 위한 커스텀 Hook
 * 쿠폰 폼 상태, 쿠폰 추가/삭제 로직을 관리합니다.
 */
export const useCoupons = ({
  coupons,
  onUpdateCoupons,
  onSuccess,
  onError,
  cart = [],
}: UseCouponsProps) => {
  const [couponForm, setCouponForm] = useState<CouponFormData>(
    createEmptyCouponForm()
  );
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      onUpdateCoupons(addCouponToList(coupons, newCoupon));
      onSuccess(SUCCESS_MESSAGES.COUPON_ADDED);
    },
    [coupons, onUpdateCoupons, onSuccess]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      onUpdateCoupons(removeCouponFromList(coupons, couponCode));
      onSuccess(SUCCESS_MESSAGES.COUPON_DELETED);
    },
    [coupons, onUpdateCoupons, onSuccess]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      const validation = validateCouponApplication(currentTotal, coupon);

      if (!validation.valid) {
        onError(validation.message!);
        return;
      }

      setSelectedCoupon(coupon);
      onSuccess(SUCCESS_MESSAGES.COUPON_APPLIED);
    },
    [cart, selectedCoupon, onSuccess, onError]
  );

  return {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  };
};
