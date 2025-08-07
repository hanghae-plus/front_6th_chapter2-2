import { CartItem, Coupon } from "../../../types";
import { CouponSelector } from "./CouponSelector";

export function CouponInfo({
  selectedCoupon,
  setSelectedCoupon,
  coupons,
  applyCoupon,
  cart,
}: {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  coupons: Coupon[];
  applyCoupon: ({ coupon, cart }: { coupon: Coupon; cart: CartItem[] }) => void;
  cart: CartItem[];
}) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      <CouponSelector
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        coupons={coupons}
        applyCoupon={applyCoupon}
        cart={cart}
      />
    </section>
  );
}
