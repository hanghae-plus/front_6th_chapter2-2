import { Coupon } from "../../../../types";
import { CartItem } from "../../../../types";
import { useAtom } from "jotai";
import { selectedCouponAtom } from "../../../atoms";
import { useCart } from "../../../hooks/useCart";
import { useCoupons } from "../../../hooks/useCoupons";

export function CouponSelector() {
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const { cart, applyCoupon } = useCart();
  const { coupons } = useCoupons();

  return (
    <select
      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      value={selectedCoupon?.code || ""}
      onChange={(e) => {
        const coupon = coupons.find((c) => c.code === e.target.value);
        if (coupon) applyCoupon({ coupon, cart });
        else setSelectedCoupon(null);
      }}
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
  );
}
