import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";

// 초기 쿠폰 데이터
const initialCoupons: Coupon[] = [
  {
    code: "AMOUNT5000",
    name: "5000원 할인",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    code: "PERCENT10",
    name: "10% 할인",
    discountType: "percentage",
    discountValue: 10,
  },
];

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);
