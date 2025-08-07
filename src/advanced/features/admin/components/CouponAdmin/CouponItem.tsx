import { useCoupon } from "@/advanced/features/coupon/hooks/useCoupon";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import Icon from "@/advanced/shared/components/icons/Icon";
import { formatPrice } from "@/advanced/shared/utils";

interface CouponItemProps {
  coupon: Coupon;
}

export default function CouponItem({ coupon }: CouponItemProps) {
  const { deleteCoupon } = useCoupon();

  const { code, name, discountType, discountValue } = coupon;

  return (
    <div
      key={code}
      className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {discountType === "amount"
                ? `${formatPrice.unit(discountValue)} 할인`
                : `${discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={() => deleteCoupon(code)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Icon type="trash" size={5} color="currentColor" />
        </button>
      </div>
    </div>
  );
}
