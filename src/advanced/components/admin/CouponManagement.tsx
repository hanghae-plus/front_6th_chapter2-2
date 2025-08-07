// 쿠폰 관리 섹션 컴포넌트 (기존 AdminPage 구조 유지)
import React from "react";
import { CouponList } from "./CouponList";
import { CouponForm } from "./CouponForm";
import { useCouponForm } from "../../hooks/useCouponForm";
import { Coupon } from "../../type/types";

interface CouponManagementProps {
  coupons: Coupon[];
  addCoupon: (newCoupon: Omit<Coupon, "id">) => void;
  removeCoupon: (couponCode: string) => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function CouponManagement({
  coupons,
  addCoupon,
  removeCoupon,
  addNotification,
}: CouponManagementProps) {
  // 폼 상태 관리 로직을 hook으로 분리
  const {
    showCouponForm,
    couponForm,
    setCouponForm,
    startAddCoupon,
    handleSubmit,
    handleCancel,
  } = useCouponForm();

  const handleCouponSubmit = (e: React.FormEvent) => {
    handleSubmit(e, addCoupon);
  };

  const handleRemoveCoupon = (couponCode: string) => {
    removeCoupon(couponCode);
    addNotification("쿠폰이 삭제되었습니다", "success");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          coupons={coupons}
          onRemoveCoupon={handleRemoveCoupon}
          onAddNewCoupon={startAddCoupon}
        />

        <CouponForm
          isVisible={showCouponForm}
          formData={couponForm}
          onFormDataChange={setCouponForm}
          onSubmit={handleCouponSubmit}
          onCancel={handleCancel}
          addNotification={addNotification}
        />
      </div>
    </section>
  );
}
