import { useState } from "react";
import { PlusIcon } from "../icon";
import CouponItem from "./CouponItem";
import CouponForm from "./CouponForm";
import { useCoupons } from "../../hooks/useCoupons";

const CouponTab = () => {
  const { coupons } = useCoupons();

  // 쿠폰 추가 (수정) 폼 표시
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 기존 쿠폰 목록 */}
          {coupons.map((coupon) => (
            <CouponItem key={coupon.code} coupon={coupon} />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              {/* 새 쿠폰 추가 + 아이콘 */}
              <PlusIcon />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm coupons={coupons} setShowCouponForm={setShowCouponForm} />
        )}
      </div>
    </section>
  );
};

export default CouponTab;
