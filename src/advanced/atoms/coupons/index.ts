import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { Coupon } from "../../types";
import { INITIAL_COUPONS } from "../../constants";
import * as composedModels from "../../models";
import * as couponModel from "../../models/coupon";
import { validateCouponAvailable, validateCouponCode } from "../../utils/validators";
import { cartAtom } from "../cart";
import { addNotificationAtom } from "../notifications";

// 쿠폰 목록 (localStorage 연동)
export const couponsAtom = atomWithStorage<Coupon[]>(
  "coupons",
  INITIAL_COUPONS
);

// 선택된 쿠폰 (메모리만)
export const selectedCouponAtom = atom<Coupon | null>(null);

// 쿠폰 추가 액션
export const addCouponAtom = atom(
  null,
  (get, set, newCoupon: Coupon) => {
    const coupons = get(couponsAtom);
    
    const validation = validateCouponCode(coupons, newCoupon.code);
    if (validation.errorMessage) {
      set(addNotificationAtom, validation.errorMessage, 'error');
      return;
    }
    
    set(couponsAtom, couponModel.addCouponToList(coupons, newCoupon));
    set(addNotificationAtom, '쿠폰이 추가되었습니다.', 'success');
  }
);

// 쿠폰 삭제 액션
export const removeCouponAtom = atom(
  null,
  (get, set, couponCode: string) => {
    const coupons = get(couponsAtom);
    const selectedCoupon = get(selectedCouponAtom);
    
    set(couponsAtom, couponModel.removeCouponFromList(coupons, couponCode));
    
    if (selectedCoupon?.code === couponCode) {
      set(selectedCouponAtom, null);
    }
    
    set(addNotificationAtom, '쿠폰이 삭제되었습니다.', 'success');
  }
);

// 쿠폰 적용 액션
export const applyCouponAtom = atom(
  null,
  (get, set, coupon: Coupon | null) => {
    if (!coupon) {
      set(selectedCouponAtom, null);
      return;
    }

    // 현재 cart 상태를 읽어서 검증
    const cart = get(cartAtom);
    const cartTotalForValidation = composedModels.calculateCartTotal(cart, null);
    const validation = validateCouponAvailable(
      coupon,
      cartTotalForValidation.totalAfterDiscount
    );

    if (validation.errorMessage) {
      set(addNotificationAtom, validation.errorMessage, 'error');
      return;
    }

    set(selectedCouponAtom, coupon);
    set(addNotificationAtom, '쿠폰이 적용되었습니다.', 'success');
  }
);
