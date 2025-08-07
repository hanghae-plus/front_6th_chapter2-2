import { useAtom, useSetAtom } from "jotai";
import { Coupon } from "../../types";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { withTryNotifySuccess } from "../utils/withNotify";
import {
  couponsAtom,
  selectedCouponAtom,
  addCouponAtom,
  deleteCouponAtom,
  applyCouponAtom,
  setSelectedCouponAtom,
} from "../stores/couponStore";

export const useCoupons = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  const [coupons] = useAtom(couponsAtom);
  const [selectedCoupon] = useAtom(selectedCouponAtom);

  const addCouponSet = useSetAtom(addCouponAtom);
  const deleteCouponSet = useSetAtom(deleteCouponAtom);
  const applyCouponSet = useSetAtom(applyCouponAtom);
  const setSelectedCouponSet = useSetAtom(setSelectedCouponAtom);

  const addCoupon = (newCoupon: Coupon) => {
    addCouponSet(newCoupon);
  };

  const deleteCoupon = (couponCode: string) => {
    deleteCouponSet(couponCode);
  };

  const applyCoupon = (coupon: Coupon, currentTotal: number) => {
    applyCouponSet({ coupon, currentTotal });
  };

  const setSelectedCoupon = (coupon: Coupon | null) => {
    setSelectedCouponSet(coupon);
  };

  const handleAddCoupon = useAutoCallback(
    withTryNotifySuccess(addCoupon, "쿠폰이 추가되었습니다.", addNotification ?? (() => {}))
  );

  const handleDeleteCoupon = useAutoCallback(
    withTryNotifySuccess(deleteCoupon, "쿠폰이 삭제되었습니다.", addNotification ?? (() => {}))
  );

  const handleApplyCoupon = useAutoCallback(
    withTryNotifySuccess(applyCoupon, "쿠폰이 적용되었습니다.", addNotification ?? (() => {}))
  );

  return {
    coupons,
    selectedCoupon,
    addCoupon: handleAddCoupon,
    deleteCoupon: handleDeleteCoupon,
    applyCoupon: handleApplyCoupon,
    setSelectedCoupon,
  };
};
