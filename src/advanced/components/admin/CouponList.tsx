// 쿠폰 목록 컴포넌트 (기존 AdminPage 구조 유지)
import { TrashIcon, PlusIcon } from "../icons";
import { Coupon } from "../../type/types";

interface CouponListProps {
  coupons: Coupon[];
  onRemoveCoupon: (couponCode: string) => void;
  onAddNewCoupon: () => void;
}

export function CouponList({
  coupons,
  onRemoveCoupon,
  onAddNewCoupon,
}: CouponListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
              <p className="text-sm text-gray-600 mt-1 font-mono">
                {coupon.code}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                  {coupon.discountType === "amount"
                    ? `${coupon.discountValue.toLocaleString()}원 할인`
                    : `${coupon.discountValue}% 할인`}
                </span>
              </div>
            </div>
            <button
              onClick={() => onRemoveCoupon(coupon.code)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={onAddNewCoupon}
          className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
        >
          <PlusIcon className="w-8 h-8" />
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
}
