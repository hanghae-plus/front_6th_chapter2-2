import { useState, useCallback } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface UseCouponsProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

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

export function useCoupons({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: UseCouponsProps) {
  // =====================================
  // 상태 관리
  // =====================================

  // 로컬스토리지에서 쿠폰 목록을 불러와 초기화
  const [coupons, setCoupons] = useLocalStorage("coupons", initialCoupons);

  // 쿠폰 폼 관련 상태들
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  // =====================================
  // 쿠폰 관리 함수
  // =====================================

  /**
   * 새 쿠폰 추가
   */
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  /**
   * 쿠폰 삭제
   */
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, setSelectedCoupon, addNotification]
  );

  // =====================================
  // 폼 관리 함수들
  // =====================================

  /**
   * 쿠폰 폼 표시/숨김 토글
   */
  const toggleCouponForm = useCallback(() => {
    setShowCouponForm(!showCouponForm);
  }, [showCouponForm]);

  /**
   * 쿠폰 폼 필드 변경
   */
  const updateCouponForm = useCallback((field: string, value: any) => {
    setCouponForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * 쿠폰 폼 취소
   */
  const cancelCouponForm = useCallback(() => {
    setShowCouponForm(false);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
  }, []);

  /**
   * 쿠폰 폼 제출
   */
  const submitCouponForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      setCouponForm({
        name: "",
        code: "",
        discountType: "amount",
        discountValue: 0,
      });
      setShowCouponForm(false);
    },
    [couponForm, addCoupon]
  );

  // =====================================
  // 반환값
  // =====================================

  return {
    // 상태
    coupons,
    showCouponForm,
    couponForm,

    onShowCouponForm: toggleCouponForm,
    onCouponSubmit: submitCouponForm,
    onCouponFormChange: updateCouponForm,
    onCancelCouponForm: cancelCouponForm,
    onDeleteCoupon: deleteCoupon,
  };
}
