import { useCallback } from "react";
import { useNotification } from "../../hooks/useNotification";
import { ICoupon } from "../../type";
import { TrashIcon } from "../icon";
import { useCoupons } from "../../hooks/useCoupons";
import { useCart } from "../../hooks/useCart";
import { MESSAGES } from "../../constants/messages";

interface CouponItemProps {
  coupon: ICoupon;
}

const CouponItem = ({ coupon }: CouponItemProps) => {
  const { addNotification } = useNotification();
  const { selectedCoupon, setSelectedCoupon } = useCart();
  const { deleteCoupon } = useCoupons();

  // 쿠폰 삭제
  const deleteCouponItem = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification(MESSAGES.COUPON.DELETED, "success");
    },
    [selectedCoupon, addNotification]
  );

  return (
    <div
      key={coupon.code}
      className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === "amount"
                ? `${coupon.discountValue.toLocaleString()}원 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={() => deleteCouponItem(coupon.code)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          {/* 쿠폰 - 휴지통 아이콘 */}
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default CouponItem;
