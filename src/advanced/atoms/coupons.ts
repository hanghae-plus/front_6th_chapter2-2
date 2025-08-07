import { atom } from "jotai";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { selectedCouponAtom } from "./selectedCoupon";

const getInitialCoupons = (): Array<Coupon> => {
  try {
    const stored = localStorage.getItem("coupons");
    return stored ? JSON.parse(stored) : initialCoupons;
  } catch {
    return initialCoupons;
  }
};

export const couponsAtom = atom<Array<Coupon>>([]);

export const couponsWithLocalStorageAtom = atom(
  (get) => {
    const currentCoupons = get(couponsAtom);
    if (currentCoupons.length === 0) {
      return getInitialCoupons();
    }
    return currentCoupons;
  },
  (_get, set, newCoupons: Array<Coupon>) => {
    set(couponsAtom, newCoupons);
    localStorage.setItem("coupons", JSON.stringify(newCoupons));
  }
);

export const hasCouponAtom = atom((get) => (code: string) => {
  const coupons = get(couponsWithLocalStorageAtom);
  return coupons.some((c) => c.code === code);
});

export const addCouponAtom = atom(
  null,
  (
    get,
    set,
    {
      newCoupon,
      isCouponExists,
    }: { newCoupon: Coupon; isCouponExists: boolean }
  ) => {
    if (isCouponExists) return false;
    const coupons = get(couponsWithLocalStorageAtom);
    const updatedCoupons = [...coupons, newCoupon];
    set(couponsWithLocalStorageAtom, updatedCoupons);
    return true;
  }
);

export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  const coupons = get(couponsWithLocalStorageAtom);
  const selectedCoupon = get(selectedCouponAtom);

  const updatedCoupons = coupons.filter((c) => c.code !== couponCode);
  set(couponsWithLocalStorageAtom, updatedCoupons);

  if (selectedCoupon?.code === couponCode) {
    set(selectedCouponAtom, null);
  }
});

export const applyCouponAtom = atom(
  null,
  (
    _get,
    set,
    { coupon, currentTotal }: { coupon: Coupon; currentTotal: number }
  ) => {
    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      return false;
    }
    set(selectedCouponAtom, coupon);
    return true;
  }
);
