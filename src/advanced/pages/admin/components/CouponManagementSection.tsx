import { useState } from "react";
import { CouponCard } from "../../../components/admin/CouponCard";
import { CouponForm } from "../../../components/admin/CouponForm";
import { PlusIcon } from "../../../components/icons";
import { useCoupon } from "../../../hooks/useCoupon";

const CouponManagementSection = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const { coupons } = useCoupon();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm handleCancelCoupon={() => setShowCouponForm(false)} />
        )}
      </div>
    </section>
  );
};

export default CouponManagementSection;
