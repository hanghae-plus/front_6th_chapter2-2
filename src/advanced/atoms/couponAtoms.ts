import { atom } from "jotai";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants/data";
import { INITIAL_COUPON_FORM } from "../hooks/useCouponForm";

/** 쿠폰 목록 */
export const couponsAtom = atom<Coupon[]>(initialCoupons);

/** 선택된 쿠폰 */
export const selectedCouponAtom = atom<Coupon | null>(null);

/** 쿠폰 폼 표시 상태 */
export const showCouponFormAtom = atom<boolean>(false);

/** 쿠폰 폼 데이터 */
export const couponFormAtom = atom(INITIAL_COUPON_FORM);
