import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";
import { INITIAL_COUPONS } from "../../constants";
import { atom } from "jotai";

// 쿠폰 목록 (localStorage 연동)
export const couponsAtom = atomWithStorage<Coupon[]>(
  "coupons",
  INITIAL_COUPONS
);

// 선택된 쿠폰 (메모리만)
export const selectedCouponAtom = atom<Coupon | null>(null);
