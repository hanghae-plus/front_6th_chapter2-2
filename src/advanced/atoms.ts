import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { initialCoupons, initialProducts } from "./constants";
import { CartItem, Coupon } from "../types";
import { ProductWithUI } from "./App";

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

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);
