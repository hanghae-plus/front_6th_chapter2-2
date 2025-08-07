import { useCallback } from "react";

import { couponData } from "@/basic/features/coupon/data/coupon.data";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { throwNotificationError } from "@/basic/features/notification/utils/notificationError.util";
import { useLocalStorage } from "@/basic/shared/hooks/useLocalStorage";

interface Props {
  resetCoupon: () => void;
  selectedCoupon: Coupon | null;
}

export function useCoupon({ resetCoupon, selectedCoupon }: Props) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    couponData.initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        throwNotificationError.error("이미 존재하는 쿠폰 코드입니다.");

        return;
      }

      setCoupons((prev) => [...prev, newCoupon]);

      throwNotificationError.success("쿠폰이 추가되었습니다.");
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));

      if (selectedCoupon?.code === couponCode) {
        resetCoupon();
      }

      throwNotificationError.success("쿠폰이 삭제되었습니다.");
    },
    [selectedCoupon]
  );

  return { coupons, addCoupon, deleteCoupon };
}
