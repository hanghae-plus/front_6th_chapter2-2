import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";
import { DuplicateCouponCodeError, CouponUsageConditionError } from "../errors/Coupon.error";
import { isDuplicateCoupon, checkCouponUsageConditions } from "../models/coupon";

// 초기 쿠폰 데이터
const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

// 쿠폰 목록 상태 atom (localStorage와 연동)
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

// 선택된 쿠폰 상태 atom (localStorage와 연동)
export const selectedCouponAtom = atomWithStorage<Coupon | null>("selectedCoupon", null);

// 쿠폰 추가하는 atom
export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const coupons = get(couponsAtom);

  if (isDuplicateCoupon(coupons, newCoupon)) {
    throw new DuplicateCouponCodeError(newCoupon.code);
  }

  set(couponsAtom, (prev) => [...prev, newCoupon]);
});

// 쿠폰 삭제하는 atom
export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  const selectedCoupon = get(selectedCouponAtom);

  set(couponsAtom, (prev) => prev.filter((c) => c.code !== couponCode));

  // 선택된 쿠폰이 삭제되는 경우 선택 해제
  if (selectedCoupon?.code === couponCode) {
    set(selectedCouponAtom, null);
  }
});

// 쿠폰 적용하는 atom
export const applyCouponAtom = atom(
  null,
  (_, set, { coupon, currentTotal }: { coupon: Coupon; currentTotal: number }) => {
    const { canUse } = checkCouponUsageConditions(currentTotal, coupon);

    if (!canUse) {
      throw new CouponUsageConditionError(coupon.discountType, 10000);
    }

    set(selectedCouponAtom, coupon);
  }
);

// 선택된 쿠폰 설정하는 atom
export const setSelectedCouponAtom = atom(null, (_, set, coupon: Coupon | null) => {
  set(selectedCouponAtom, coupon);
});
