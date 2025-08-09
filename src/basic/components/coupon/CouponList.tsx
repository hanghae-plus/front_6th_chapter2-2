import { Coupon } from "../../../types";
import { getCouponDisplayText } from "../../utils/couponUtils";

interface CouponListProps {
  coupons: Coupon[];
  onApplyCoupon: (coupon: Coupon) => void;
  selectedCoupon: Coupon | null;
}

export const CouponList: React.FC<CouponListProps> = ({
  coupons,
  onApplyCoupon,
  selectedCoupon,
}) => {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">사용 가능한 쿠폰이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedCoupon?.code === coupon.code
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onApplyCoupon(coupon)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">{coupon.name}</h4>
              <p className="text-sm text-gray-600 font-mono">{coupon.code}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getCouponDisplayText(coupon)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
