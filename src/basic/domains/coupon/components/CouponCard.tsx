import { TrashIcon } from "../../../shared";
import type { Coupon } from "../types";

type CouponCardProps = {
  coupon: Coupon;
  onDelete: (code: string) => void;
};

export function CouponCard({ coupon, onDelete }: CouponCardProps) {
  const handleDelete = () => {
    onDelete(coupon.code);
  };

  return (
    <div className="relative rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="mt-1 font-mono text-sm text-gray-600">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-indigo-700">
              {coupon.discountType === "amount"
                ? `${coupon.discountValue.toLocaleString()}원 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 transition-colors hover:text-red-600"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
