import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface UseCouponProps {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

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

export function useCoupon({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: UseCouponProps) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find(
        (coupon) => coupon.code === newCoupon.code
      );

      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));

      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }

      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
