import { atom } from "jotai";
import { Coupon } from "../models";

export const couponsAtom = atom<Coupon[]>([]);
export const showCouponFormAtom = atom(false);
export const couponFormAtom = atom({
  code: "",
  discount: 0,
  type: "percentage" as "percentage" | "fixed",
  minPurchase: 0,
});
