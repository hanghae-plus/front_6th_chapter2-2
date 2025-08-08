import React from "react";
import { CouponGrid } from "../coupon/CouponGrid";
import { CouponForm } from "../coupon/CouponForm";
import type { NotificationType } from "../../types/admin";

// hooks
import { useCoupons } from "../../hooks/useCoupons";
import { useCouponForm } from "../../hooks/useCouponForm";

interface CouponManagementProps {
  addNotification: (message: string, type: NotificationType) => void;
}

const CouponManagement = ({ addNotification }: CouponManagementProps) => {
  // NotificationType을 훅에서 기대하는 타입으로 변환
  const handleNotification = (message: string, type?: "success" | "error" | "warning") => {
    if (type === "success" || type === "error") {
      addNotification(message, type);
    }
  };

  const { coupons, addCoupon, deleteCoupon } = useCoupons(handleNotification);
  const { couponForm, showCouponForm, updateField, showForm, hideForm, handleCouponSubmit } = useCouponForm();

  // Coupon Form 제출 처리
  const handleCouponFormSubmit = (e: React.FormEvent) => {
    handleCouponSubmit(e, addCoupon);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponGrid coupons={coupons} onDeleteCoupon={deleteCoupon} onAddCoupon={showForm} />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            updateField={updateField}
            onSubmit={handleCouponFormSubmit}
            onCancel={hideForm}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponManagement;
