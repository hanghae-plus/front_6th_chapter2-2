import { atom } from "jotai";
import { Coupon } from "../type/types";

export const selectedCouponAtom = atom<Coupon | null>(null);
