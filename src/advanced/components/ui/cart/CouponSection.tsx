import { CartItem } from "../../../../types";
import { CouponWithUI } from "../../../entities/coupon/coupon.types";
import { useCouponHandlers } from "../../../entities/coupon/useCouponHandlers";
import { useCartHandlers } from "../../../entities/cart/useCartHandlers";
import { useNotifications } from "../../../hooks/useNotifications";

export const CouponSection = () => {
  // Hooks를 직접 사용
  const { addNotification } = useNotifications();
  const couponHandlers = useCouponHandlers({ addNotification });
  const cartHandlers = useCartHandlers({ addNotification });

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = couponHandlers.state.items.find(
      (c) => c.code === e.target.value
    );
    if (coupon) {
      couponHandlers.actions.apply(coupon, cartHandlers.state.items);
    } else {
      couponHandlers.actions.setSelected(null);
    }
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">쿠폰 적용</h2>
        {couponHandlers.state.selected && (
          <button
            onClick={() => couponHandlers.actions.clearSelected()}
            className="text-sm text-red-600 hover:text-red-800"
          >
            쿠폰 해제
          </button>
        )}
      </div>
      <select
        value={couponHandlers.state.selected?.code || ""}
        onChange={handleCouponChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">쿠폰을 선택하세요</option>
        {couponHandlers.state.items.map((coupon) => (
          <option key={coupon.code} value={coupon.code}>
            {coupon.name} (
            {coupon.discountType === "amount"
              ? `${coupon.discountValue.toLocaleString()}원`
              : `${coupon.discountValue}%`}{" "}
            할인)
          </option>
        ))}
      </select>
      {couponHandlers.state.selected && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>{couponHandlers.state.selected.name}</strong> 쿠폰이
            적용되었습니다.
          </p>
          <p className="text-xs text-green-600 mt-1">
            {couponHandlers.state.selected.discountType === "amount"
              ? `${couponHandlers.state.selected.discountValue.toLocaleString()}원 할인`
              : `${couponHandlers.state.selected.discountValue}% 할인`}
          </p>
        </div>
      )}
    </section>
  );
};
