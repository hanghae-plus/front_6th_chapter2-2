import { useState } from "react";
import { Coupon } from "../../../types";
import { useCoupons } from "../../hooks/useCoupons";
import { CouponCard } from "./CouponCard";
import { AddNewCouponCard } from "./AddNewCouponCard";
import { CouponForm } from "./CouponForm";

export function CouponTab({
  selectedCoupon,
  setSelectedCoupon,
  addNotification,
}: {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}) {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const { coupons, applyAddCoupon, applyDeleteCoupon } = useCoupons({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              applyDeleteCoupon={applyDeleteCoupon}
            />
          ))}
          <AddNewCouponCard
            setShowCouponForm={setShowCouponForm}
            showCouponForm={showCouponForm}
          />
        </div>

        {showCouponForm && (
          <CouponForm
            addNotification={addNotification}
            setShowCouponForm={setShowCouponForm}
            applyAddCoupon={applyAddCoupon}
          />
        )}
      </div>
    </section>
  );
}
