import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { couponData } from "@/advanced/features/coupon/data/coupon.data";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import { throwNotificationError } from "@/advanced/features/notification/utils/notificationError.util";

const coupons = atomWithStorage<Coupon[]>("coupons", couponData.initialCoupons);

const selectedCoupon = atom<Coupon | null>(null);

const addCoupon = atom(null, (get, set, newCoupon: Coupon) => {
  const existingCoupon = get(coupons).find((c) => c.code === newCoupon.code);

  if (existingCoupon) {
    throwNotificationError.error("이미 존재하는 쿠폰 코드입니다.");

    return;
  }

  set(coupons, [...get(coupons), newCoupon]);

  throwNotificationError.success("쿠폰이 추가되었습니다.");
});

const deleteCoupon = atom(null, (get, set, couponCode: string) => {
  set(
    coupons,
    get(coupons).filter((c) => c.code !== couponCode)
  );

  if (get(selectedCoupon)?.code === couponCode) {
    set(selectedCoupon, null);
  }

  throwNotificationError.success("쿠폰이 삭제되었습니다.");
});

const setSelectedCoupon = atom(null, (_, set, coupon: Coupon) => {
  set(selectedCoupon, coupon);
});

const resetCoupon = atom(null, (_, set) => {
  set(selectedCoupon, null);
});

export default {
  coupons,
  addCoupon,
  deleteCoupon,
  selectedCoupon,
  setSelectedCoupon,
  resetCoupon,
};
