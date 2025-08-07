import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { initialCoupons, initialProducts } from "./constants";
import { Coupon } from "../types";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export const selectedCouponAtom = atom<Coupon | null>(null);
export const isAdminAtom = atom(false);
export const notificationsAtom = atom<Notification[]>([]);
export const searchTermAtom = atom("");
export const totalItemCountAtom = atom(0);

export const couponsAtom = atomWithStorage("coupons", initialCoupons);
export const productsAtom = atomWithStorage("products", initialProducts);
export const cartAtom = atomWithStorage("cart", []);
