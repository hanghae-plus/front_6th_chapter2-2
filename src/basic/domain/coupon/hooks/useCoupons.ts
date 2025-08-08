import { useState, useCallback, useEffect } from "react";
import { Coupon } from "../models";
import { initialCoupons } from "../constants";
import { generateCouponCode } from "../utils";

export const useCoupons = (
  addNotification?: (
    message: string,
    type?: "success" | "error" | "warning"
  ) => void,
  selectedCoupon?: Coupon | null,
  setSelectedCoupon?: (coupon: Coupon | null) => void
) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  // 관리자 페이지용 폼 상태
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback(
    (newCoupon: Omit<Coupon, "code">) => {
      const coupon: Coupon = {
        ...newCoupon,
        code: generateCouponCode(newCoupon.name),
      };
      setCoupons((prev) => [...prev, coupon]);
      addNotification?.("쿠폰이 추가되었습니다.", "success");
      setShowCouponForm(false);
      setCouponForm({
        name: "",
        code: "",
        discountType: "percentage",
        discountValue: 0,
      });
    },
    [addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));

      // 삭제된 쿠폰이 현재 선택된 쿠폰이라면 선택 해제
      if (selectedCoupon?.code === couponCode && setSelectedCoupon) {
        setSelectedCoupon(null);
      }

      addNotification?.("쿠폰이 삭제되었습니다.", "success");
    },
    [addNotification, selectedCoupon, setSelectedCoupon]
  );

  // 쿠폰 폼 제출 처리
  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const existingCoupon = coupons.find((c) => c.code === couponForm.code);
      if (existingCoupon) {
        addNotification?.("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      const newCoupon: Coupon = {
        name: couponForm.name,
        code: couponForm.code || generateCouponCode(couponForm.name),
        discountType: couponForm.discountType,
        discountValue: couponForm.discountValue,
      };

      setCoupons((prev) => [...prev, newCoupon]);
      addNotification?.("쿠폰이 추가되었습니다.", "success");
      setCouponForm({
        name: "",
        code: "",
        discountType: "percentage",
        discountValue: 0,
      });
      setShowCouponForm(false);
    },
    [coupons, couponForm, addNotification]
  );

  // 쿠폰 폼 리셋
  const resetCouponForm = useCallback(() => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
    setShowCouponForm(false);
  }, []);

  return {
    // 상태
    coupons,
    showCouponForm,
    couponForm,

    // 상태 변경 함수들
    setCoupons,
    setShowCouponForm,
    setCouponForm,

    // 액션 함수들
    addCoupon,
    deleteCoupon,
    handleCouponSubmit,
    resetCouponForm,
  };
};
