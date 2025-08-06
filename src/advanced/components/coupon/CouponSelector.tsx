import { ICoupon } from "../../type";
import { useCoupons } from "../../hooks/useCoupons";
import { useCallback } from "react";
import { ORDER } from "../../constants/business";
import { MESSAGES } from "../../constants/messages";
import { useNotification } from "../../hooks/useNotification";
import { useCart } from "../../hooks/useCart";

const CouponSelector = () => {
  const { coupons } = useCoupons();
  const { selectedCoupon, setSelectedCoupon, cartTotalPrice } = useCart();
  const { addNotification } = useNotification();

  // 쿠폰 적용 함수
  const applyCoupon = useCallback(
    (coupon: ICoupon) => {
      // 할인 적용 전 총 가격
      const currentTotal = cartTotalPrice.totalAfterDiscount;

      // 총 가격 10000원 이하일 경우 처리
      if (
        currentTotal < ORDER.MIN_FOR_COUPON &&
        coupon.discountType === "percentage"
      ) {
        addNotification(MESSAGES.COUPON.MIN_PRICE, "error");
        return;
      }

      // 쿠폰 적용 후 알림 처리
      setSelectedCoupon(coupon);
      addNotification(MESSAGES.COUPON.APPLIED, "success");
    },
    [addNotification, cartTotalPrice]
  );

  // 쿠폰 선택 함수
  const handleSelectCoupon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value);

    if (coupon) applyCoupon(coupon);
    else setSelectedCoupon(null);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      {coupons.length > 0 && (
        <select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ""}
          onChange={handleSelectCoupon}
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
};

export default CouponSelector;
