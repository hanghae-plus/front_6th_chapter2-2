import { type FormEvent } from "react";

import { AddCouponCard, type Coupon, CouponCard, CouponForm } from "../../domains/coupon";

type CouponFormType = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type CouponManagementSectionProps = {
  coupons: Coupon[];
  couponForm: CouponFormType;
  showCouponForm: boolean;
  onToggleForm: () => void;
  onDelete: (code: string) => void;
  onFormSubmit: (e: FormEvent) => void;
  onFormCancel: () => void;
  onFormChange: (form: CouponFormType) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export function CouponManagementSection({
  coupons,
  couponForm,
  showCouponForm,
  onToggleForm,
  onDelete,
  onFormSubmit,
  onFormCancel,
  onFormChange,
  addNotification
}: CouponManagementSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} onDelete={onDelete} />
          ))}
          <AddCouponCard onClick={onToggleForm} />
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onSubmit={onFormSubmit}
            onCancel={onFormCancel}
            onFormChange={onFormChange}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
}
