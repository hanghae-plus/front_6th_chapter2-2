import { useCoupon } from "../../../hooks/useCoupon";
import { useCartTotals } from "../../../hooks/useCartTotals";
import { Coupon } from "../../../../types";
import { DeleteIcon } from "../../elements/Icons";

interface ICouponCardProps {
  coupon: Coupon;
}

const CouponCard = ({ coupon }: ICouponCardProps) => {
  /** 장바구니 총액 계산 (쿠폰 관리용) */
  const cartTotals = useCartTotals({ calculateItemTotal: () => 0 });

  /** 쿠폰 관련 actions - useCoupon hook 사용 */
  const { deleteCoupon } = useCoupon({ cartTotals });

  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원 할인` : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button onClick={() => deleteCoupon(coupon.code)} className="text-gray-400 hover:text-red-600 transition-colors">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
