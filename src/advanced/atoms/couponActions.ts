import { atom } from "jotai";
import { couponsAtom, selectedCouponAtom } from "./appAtoms";
import { Coupon } from "../../types";
import { addSuccessNotificationActionAtom } from "./notificationActions";
import { SUCCESS_MESSAGES } from "../constants/messages";

/**
 * 쿠폰 추가 액션
 */
export const addCouponActionAtom = atom(
  null,
  (
    get,
    set,
    { newCoupon }: { newCoupon: Omit<Coupon, "name"> & { name: string } }
  ) => {
    const coupons = get(couponsAtom);
    const updatedCoupons = [...coupons, newCoupon as Coupon];
    set(couponsAtom, updatedCoupons);
    set(addSuccessNotificationActionAtom, SUCCESS_MESSAGES.COUPON_ADDED);
  }
);

/**
 * 쿠폰 삭제 액션
 */
export const deleteCouponActionAtom = atom(
  null,
  (get, set, { couponCode }: { couponCode: string }) => {
    const coupons = get(couponsAtom);
    const updatedCoupons = coupons.filter(
      (coupon) => coupon.code !== couponCode
    );
    set(couponsAtom, updatedCoupons);

    const selectedCoupon = get(selectedCouponAtom);
    if (selectedCoupon?.code === couponCode) {
      set(selectedCouponAtom, null);
    }

    set(addSuccessNotificationActionAtom, SUCCESS_MESSAGES.COUPON_DELETED);
  }
);

/**
 * 쿠폰 적용 액션
 */
export const applyCouponActionAtom = atom(null, (_get, set, coupon: Coupon) => {
  set(selectedCouponAtom, coupon);
});

/**
 * 쿠폰 선택 해제 액션
 */
export const clearSelectedCouponActionAtom = atom(null, (_get, set) => {
  set(selectedCouponAtom, null);
});
