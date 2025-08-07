import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../type/types";
import { initialCoupons } from "../data/initialData";

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
