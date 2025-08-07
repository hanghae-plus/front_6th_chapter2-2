import CouponItem from "./CouponItem";

import { useState } from "react";

import AdminSection from "@/advanced/features/admin/components/AdminSection";
import CouponForm from "@/advanced/features/admin/components/CouponAdmin/CouponForm";
import { useCoupon } from "@/advanced/features/coupon/hooks/useCoupon";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import Icon from "@/advanced/shared/components/icons/Icon";

export default function CouponAdmin() {
  const { coupons } = useCoupon();

  const [showCouponForm, setShowCouponForm] = useState(false);

  const toggleShowCouponForm = () => {
    setShowCouponForm((prev) => !prev);
  };

  return (
    <AdminSection>
      <AdminSection.Header>
        <AdminSection.Title>쿠폰 관리</AdminSection.Title>
      </AdminSection.Header>

      <AdminSection.Content>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon: Coupon) => (
              <CouponItem key={coupon.code} coupon={coupon} />
            ))}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
              <button
                onClick={toggleShowCouponForm}
                className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
              >
                <Icon type="plus" size={8} color="currentColor" />
                <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
              </button>
            </div>
          </div>

          {showCouponForm && (
            <CouponForm setShowCouponForm={setShowCouponForm} />
          )}
        </div>
      </AdminSection.Content>
    </AdminSection>
  );
}
