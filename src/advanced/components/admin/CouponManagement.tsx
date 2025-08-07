import React from "react";
import { CouponGrid } from "../coupon/CouponGrid";
import { CouponForm } from "../coupon/CouponForm";
import type { CouponFormState } from "../../types/admin";
import type { Coupon } from "../../../types";

interface CouponManagementProps {
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  showCouponForm: boolean;
  couponForm: CouponFormState;
  showForm: () => void;
  hideForm: () => void;
  updateField: (field: keyof CouponFormState, value: string | number) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

const CouponManagement = ({
  coupons,
  onDeleteCoupon,
  showCouponForm,
  showForm,
  hideForm,
  couponForm,
  updateField,
  onCouponSubmit,
  addNotification,
}: CouponManagementProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponGrid coupons={coupons} onDeleteCoupon={onDeleteCoupon} onAddCoupon={showForm} />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            updateField={updateField}
            onSubmit={onCouponSubmit}
            onCancel={hideForm}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponManagement;
