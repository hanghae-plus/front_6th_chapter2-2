import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../../types";
import { initialCoupons } from "../../data";
import { atom } from "jotai";

// 쿠폰 상태 atom
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

export const selectedCouponAtom = atom<Coupon | null>(null);
