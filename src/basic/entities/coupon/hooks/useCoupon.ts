import { useCallback } from "react";
import { Coupon, DiscountType } from "@/types";
import { useCouponStore } from "./useCouponStore";

export enum CouponErrorReason {
  DUPLICATE_CODE = "DUPLICATE_CODE",
  INSUFFICIENT_AMOUNT = "INSUFFICIENT_AMOUNT",
}

interface UseCouponOptions {
  onAddCoupon?: (coupon: Coupon) => void;
  onDeleteCoupon?: (code: string) => void;
  onAddCouponError?: (coupon: Coupon, reason: CouponErrorReason) => void;
  onApplyCouponError?: (coupon: Coupon, reason: CouponErrorReason) => void;
}

export function useCoupon(options: UseCouponOptions = {}) {
  const { onAddCoupon, onDeleteCoupon, onAddCouponError, onApplyCouponError } =
    options;
  const couponStore = useCouponStore();

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (couponStore.isDuplicateCode(newCoupon.code)) {
        onAddCouponError?.(newCoupon, CouponErrorReason.DUPLICATE_CODE);
        return;
      }

      couponStore.addCoupon(newCoupon);
      onAddCoupon?.(newCoupon);
    },
    [couponStore, onAddCoupon, onAddCouponError]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      couponStore.deleteCoupon(code);
      onDeleteCoupon?.(code);
    },
    [couponStore, onDeleteCoupon]
  );

  const applyCoupon = useCallback(
    (
      coupon: Coupon,
      currentTotal: number,
      onApply: (coupon: Coupon) => void
    ) => {
      if (
        currentTotal < 10000 &&
        coupon.discountType === DiscountType.PERCENTAGE
      ) {
        onApplyCouponError?.(coupon, CouponErrorReason.INSUFFICIENT_AMOUNT);
        return;
      }

      onApply(coupon);
    },
    [onApplyCouponError]
  );

  return {
    ...couponStore,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  };
}
