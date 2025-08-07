import { useCallback } from "react";
import { useAtom } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../atoms/couponAtom";
import { Coupon, CartItem } from "../../types";
import couponService from "../services/coupon";
import cartService from "../services/cart";
import { useNotification } from "./useNotification";

export function useCoupon() {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const { addNotification } = useNotification();

  // 액션 함수들
  const applyCoupon = useCallback(
    (coupon: Coupon, cart: CartItem[]) => {
      const cartTotal = cartService.calculateCartTotal({
        cart,
        selectedCoupon: null, // 쿠폰 적용 전 총액 계산
      }).totalAfterDiscount;

      const validation = couponService.apply({
        coupon,
        cartTotal,
      });

      if (validation.isValid) {
        setSelectedCoupon(coupon);
        addNotification("쿠폰이 적용되었습니다.", "success");
      } else {
        addNotification(validation.message, "error");
      }

      return validation;
    },
    [setSelectedCoupon, addNotification]
  );

  const addCoupon = useCallback(
    (coupon: Coupon) => {
      const result = couponService.addCoupon({
        coupons,
        newCoupon: coupon,
      });

      if (result.status === "success") {
        setCoupons(result.value);
        addNotification("쿠폰이 추가되었습니다.", "success");
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [coupons, setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const result = couponService.deleteCoupon({
        coupons,
        couponCode,
      });

      if (result.status === "success") {
        const newSelectedCoupon =
          selectedCoupon?.code === couponCode ? null : selectedCoupon;

        setCoupons(result.value);
        setSelectedCoupon(newSelectedCoupon);
        addNotification("쿠폰이 삭제되었습니다.", "success");
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [coupons, selectedCoupon, setCoupons, setSelectedCoupon, addNotification]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  // 계산 함수들
  const getDiscountAmount = useCallback(
    (totalBeforeDiscount: number, totalAfterDiscount: number) => {
      return couponService.getDiscountAmount(
        totalBeforeDiscount,
        totalAfterDiscount
      );
    },
    []
  );

  const calculateDiscountRate = useCallback(
    (originalPrice: number, discountedPrice: number) => {
      return couponService.calculateDiscountRate(
        originalPrice,
        discountedPrice
      );
    },
    []
  );

  const hasDiscount = useCallback(
    (totalBeforeDiscount: number, totalAfterDiscount: number) => {
      return couponService.hasDiscount(totalBeforeDiscount, totalAfterDiscount);
    },
    []
  );

  return {
    selectedCoupon,
    coupons,
    applyCoupon,
    addCoupon,
    deleteCoupon,
    clearSelectedCoupon,
    getDiscountAmount,
    calculateDiscountRate,
    hasDiscount,
  };
}
