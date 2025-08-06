import { useCallback } from "react";

import { initialCoupons } from "@/basic/data/coupon.data";
import { useLocalStorage } from "@/basic/hooks";
import { Coupon, NotificationType } from "@/types";

interface Props {
  addNotification: (message: string, type: NotificationType) => void;
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
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification(
          "이미 존재하는 쿠폰 코드입니다.",
          NotificationType.ERROR
        );
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", NotificationType.SUCCESS);
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        resetCoupon();
      }
      addNotification("쿠폰이 삭제되었습니다.", NotificationType.SUCCESS);
    },
    [selectedCoupon, addNotification]
  );

  return { coupons, addCoupon, deleteCoupon };
}
