import type { ChangeEvent } from "react";

import type { Coupon } from "../../../../types";

type CouponSelectorProps = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
};

export function CouponSelector({
  coupons,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon
}: CouponSelectorProps) {
  const handleCouponChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((coupon) => coupon.code === event.target.value);
    if (coupon) applyCoupon(coupon);
    else setSelectedCoupon(null);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
      </div>
      {coupons.length > 0 && (
        <select
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={selectedCoupon?.code || ""}
          onChange={handleCouponChange}
        >
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} (
              {coupon.discountType === "amount"
                ? `${coupon.discountValue.toLocaleString()}원`
                : `${coupon.discountValue}%`}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
}
