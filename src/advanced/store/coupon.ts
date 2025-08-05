// 쿠폰 관련 액션

import { atom } from "jotai";
import { addNotificationHelper, selectedCouponAtom } from ".";
import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";
import { initialCoupons } from "../data";
import { cartAtom } from "./cart";
import { calculateCartTotal } from "../service/cart";

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  try {
    const coupons = get(couponsAtom);
    const existingCoupon = coupons.find((c) => c.code === newCoupon.code);

    if (existingCoupon) {
      addNotificationHelper(
        get,
        set,
        "이미 존재하는 쿠폰 코드입니다.",
        "error"
      );
      return;
    }

    set(couponsAtom, [...coupons, newCoupon]);
    addNotificationHelper(get, set, "쿠폰이 생성되었습니다.", "success");
  } catch (error) {
    addNotificationHelper(
      get,
      set,
      "쿠폰 생성 중 오류가 발생했습니다.",
      "error"
    );
  }
});

export const removeCouponAtom = atom(null, (get, set, couponCode: string) => {
  try {
    const coupons = get(couponsAtom);
    const selectedCoupon = get(selectedCouponAtom);

    // 선택된 쿠폰이 삭제되는 경우 선택 해제
    if (selectedCoupon?.code === couponCode) {
      set(selectedCouponAtom, null);
    }

    const updatedCoupons = coupons.filter(
      (coupon) => coupon.code !== couponCode
    );
    set(couponsAtom, updatedCoupons);

    addNotificationHelper(get, set, "쿠폰이 삭제되었습니다.", "success");
  } catch (error) {
    addNotificationHelper(
      get,
      set,
      "쿠폰 삭제 중 오류가 발생했습니다.",
      "error"
    );
  }
});

// 쿠폰 적용 액션
export const applyCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  try {
    const cart = get(cartAtom);
    const selectedCoupon = get(selectedCouponAtom);
    const currentTotal = calculateCartTotal(
      cart,
      selectedCoupon
    ).totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      addNotificationHelper(
        get,
        set,
        "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        "error"
      );
      return;
    }

    set(selectedCouponAtom, coupon);
    addNotificationHelper(get, set, "쿠폰이 적용되었습니다.", "success");
  } catch (error) {
    addNotificationHelper(
      get,
      set,
      "쿠폰 적용 중 오류가 발생했습니다.",
      "error"
    );
  }
});
