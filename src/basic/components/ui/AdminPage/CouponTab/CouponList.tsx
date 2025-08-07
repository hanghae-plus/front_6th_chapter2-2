import { Coupon } from "../../../../types";
import { formatPriceAtAdmin, formatPercentage } from "../../../../utils/formatters";

interface CouponListProps {
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  onAddCouponClick: () => void;
}

export function CouponList({
  coupons,
  onDeleteCoupon,
  onAddCouponClick,
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
                    ? `${formatPriceAtAdmin(coupon.discountValue)} 할인`
                    : `${formatPercentage(
                        coupon.discountValue / 100
                      )} 할인`}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDeleteCoupon(coupon.code)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={onAddCouponClick}
          className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
}