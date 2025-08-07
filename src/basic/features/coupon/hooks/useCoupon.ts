import { useCallback } from "react";

import { couponData } from "@/basic/features/coupon/data/coupon.data";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import { NOTIFICATION } from "@/basic/shared/constants/notification";
import { useLocalStorage } from "@/basic/shared/hooks/useLocalStorage";

interface Props {
  addNotification: AddNotification;
  resetCoupon: () => void;
  selectedCoupon: Coupon | null;
}

export function useCoupon({
  addNotification,
  resetCoupon,
  selectedCoupon,
}: Props) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    couponData.initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification(
          "이미 존재하는 쿠폰 코드입니다.",
          NOTIFICATION.TYPES.ERROR
        );
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", NOTIFICATION.TYPES.SUCCESS);
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        resetCoupon();
      }
      addNotification("쿠폰이 삭제되었습니다.", NOTIFICATION.TYPES.SUCCESS);
    },
    [selectedCoupon, addNotification]
  );

  return { coupons, addCoupon, deleteCoupon };
}
