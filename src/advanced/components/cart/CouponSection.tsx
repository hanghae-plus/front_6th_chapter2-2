import { Coupon } from "../../../types";
import { couponUtils } from "../../utils/couponUtils";
import couponService from "../../services/coupon";

interface CouponSectionProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  className?: string;
}

export default function CouponSection({
  coupons,
  selectedCoupon,
  applyCoupon,
  clearSelectedCoupon,
  className = "",
}: CouponSectionProps) {
  if (coupons.length === 0) return null;

  return (
    <section
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      <select
        role="combobox"
        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        value={selectedCoupon?.code || ""}
        onChange={(e) => {
          couponService.handleCouponSelection({
            coupons,
            selectedCode: e.target.value,
            applyCoupon,
            clearSelectedCoupon,
          });
        }}
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon) => (
          <option key={coupon.code} value={coupon.code}>
            {couponUtils.getDisplayText(coupon)}
          </option>
        ))}
      </select>
    </section>
  );
}
