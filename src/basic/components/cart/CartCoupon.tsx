import { Coupon } from "../../../types";

interface CartCouponProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
}

export const CartCoupon = ({ coupons, selectedCoupon, onApplyCoupon, onRemoveCoupon }: CartCouponProps) => {
  // 쿠폰 선택 핸들러
  const handleChangeCoupon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value);
    coupon ? onApplyCoupon(coupon) : onRemoveCoupon();
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
      </div>
      {coupons.length > 0 && (
        <select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ""}
          onChange={handleChangeCoupon}
        >
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon) => (
            <CouponItem key={coupon.code} coupon={coupon} />
          ))}
        </select>
      )}
    </section>
  );
};

const CouponItem = ({ coupon }: { coupon: Coupon }) => {
  return (
    <option value={coupon.code}>
      {coupon.name} (
      {coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`})
    </option>
  );
};
