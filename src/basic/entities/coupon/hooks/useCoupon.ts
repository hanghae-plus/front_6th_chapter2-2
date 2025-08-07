import { useCallback } from "react";
import { Coupon } from "../../../../types";
import { useCouponStore } from "./useCouponStore";

interface UseCouponOptions {
  onAddCoupon?: (coupon: Coupon) => void;
  onDeleteCoupon?: (code: string) => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function useCoupon(options: UseCouponOptions = {}) {
  const { onAddCoupon, onDeleteCoupon, onSuccess, onError } = options;
  const couponStore = useCouponStore();

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (couponStore.isDuplicateCode(newCoupon.code)) {
        onError?.("이미 존재하는 쿠폰 코드입니다.");
        return;
      }

      couponStore.addCoupon(newCoupon);
      onSuccess?.("쿠폰이 추가되었습니다.");

      onAddCoupon?.(newCoupon);
    },
    [couponStore, onSuccess, onError, onAddCoupon]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      couponStore.deleteCoupon(code);
      onSuccess?.("쿠폰이 삭제되었습니다.");

      onDeleteCoupon?.(code);
    },
    [couponStore, onSuccess, onDeleteCoupon]
  );

  const applyCoupon = useCallback(
    (
      coupon: Coupon,
      currentTotal: number,
      onApply: (coupon: Coupon) => void
    ) => {
      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        onError?.("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.");
        return;
      }

      onApply(coupon);
      onSuccess?.("쿠폰이 적용되었습니다.");
    },
    [onSuccess, onError]
  );

  return {
    ...couponStore,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  };
}
