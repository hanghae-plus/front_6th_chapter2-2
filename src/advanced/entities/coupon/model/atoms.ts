import { atomWithStorage } from "jotai/utils";
import type { Coupon } from "../types";
import { DiscountType } from "../types";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: DiscountType.AMOUNT,
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
  },
];

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
