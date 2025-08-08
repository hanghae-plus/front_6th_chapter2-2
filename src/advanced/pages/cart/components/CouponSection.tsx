import { Select } from "../../../components/ui/Select";
import { useCart } from "../../../hooks/useCart";
import { useCoupon, useCouponActions } from "../../../hooks/useCoupon";

const CouponSection = () => {
  const { coupons, selectedCoupon } = useCoupon();
  const { cart } = useCart();
  const { applyCoupon, unapplyCoupon } = useCouponActions();

  const handleChangeCoupon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value);

    if (coupon) {
      applyCoupon(coupon);
    } else {
      unapplyCoupon();
    }
  };

  return (
    <>
      {cart.length > 0 && (
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
            <button className="text-xs text-blue-600 hover:underline">
              쿠폰 등록
            </button>
          </div>
          {coupons.length > 0 && (
            <Select
              value={selectedCoupon?.code || ""}
              onChange={handleChangeCoupon}
            >
              <Select.Option value="">쿠폰 선택</Select.Option>
              {coupons.map((coupon) => (
                <Select.Option key={coupon.code} value={coupon.code}>
                  {coupon.name} (
                  {coupon.discountType === "amount"
                    ? `${coupon.discountValue.toLocaleString()}원`
                    : `${coupon.discountValue}%`}
                  )
                </Select.Option>
              ))}
            </Select>
          )}
        </section>
      )}
    </>
  );
};

export default CouponSection;
