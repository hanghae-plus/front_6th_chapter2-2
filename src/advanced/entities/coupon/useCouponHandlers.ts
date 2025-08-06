import { useCallback } from "react";
import { CartItem } from "../../../types";
import { CouponWithUI } from "./coupon.types";
import { useCoupon } from "./useCoupon";
import { BaseHandlerProps } from "../../types/common";

interface UseCouponHandlersProps extends BaseHandlerProps {}

/**
 * 쿠폰 관련 핸들러들을 제공하는 훅 (네임스페이스 구조)
 */
export const useCouponHandlers = ({
  addNotification,
}: UseCouponHandlersProps) => {
  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon: addCouponAction,
    deleteCoupon: deleteCouponAction,
    applyCoupon: applyCouponAction,
    clearSelectedCoupon,
    findCoupon,
  } = useCoupon();

  const add = useCallback(
    (newCoupon: Omit<CouponWithUI, "id">) => {
      const result = addCouponAction(newCoupon);
      addNotification(result.message, result.type);
    },
    [addCouponAction, addNotification]
  );

  const remove = useCallback(
    (couponCode: string) => {
      const result = deleteCouponAction(couponCode);
      addNotification(result.message, result.type);
    },
    [deleteCouponAction, addNotification]
  );

  const apply = useCallback(
    (coupon: CouponWithUI, cart: CartItem[]) => {
      const result = applyCouponAction(coupon, cart);
      addNotification(result.message, result.type);
    },
    [applyCouponAction, addNotification]
  );

  const setSelected = useCallback(
    (coupon: CouponWithUI | null) => {
      setSelectedCoupon(coupon);
    },
    [setSelectedCoupon]
  );

  const clearSelected = useCallback(() => {
    clearSelectedCoupon();
  }, [clearSelectedCoupon]);

  const find = useCallback(
    (couponCode: string) => {
      return findCoupon(couponCode);
    },
    [findCoupon]
  );

  return {
    // 네임스페이스 구조
    state: {
      items: coupons,
      selected: selectedCoupon,
    },
    actions: {
      add,
      remove,
      apply,
      setSelected,
      clearSelected,
      find,
    },

    // 하위 호환성을 위해 기존 방식도 유지
    coupons,
    selectedCoupon,
    setSelectedCoupon: setSelected,
    addCoupon: add,
    deleteCoupon: remove,
    applyCoupon: apply,
    clearSelectedCoupon: clearSelected,
    findCoupon: find,
  };
};
