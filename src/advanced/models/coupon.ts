import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";
import { initialCoupons } from "../../basic/constants/coupon";

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
