// 쿠폰 관련 액션 atom
import { atom } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../atoms/couponAtoms";
import { Coupon } from "../../../types";
import { calculateCartTotal } from "../../service/cart";
import { cartAtom } from "../atoms/cartAtoms";
import { addNotificationHelper } from "./notificationActions";
import { Getter } from "jotai";
import { Setter } from "jotai";

export const handleAddCouponAtom = atom(
  null,
  (get: Getter, set: Setter, newCoupon: Coupon) => {
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
  }
);

export const handleRemoveCouponAtom = atom(
  null,
  (get, set, couponCode: string) => {
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
  }
);

// 쿠폰 적용 액션
export const handleApplyCouponAtom = atom(
  null,
  (get: Getter, set: Setter, coupon: Coupon) => {
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
  }
);
