import { atom } from "jotai";
import { CartItem } from "../models";

export const cartAtom = atom<CartItem[]>([]);
export const selectedCouponAtom = atom<string | null>(null);
