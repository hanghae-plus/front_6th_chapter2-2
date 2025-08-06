import { CouponWithUI } from "../../../entities/coupon/coupon.types";
import { useCouponHandlers } from "../../../entities/coupon/useCouponHandlers";
import { useNotifications } from "../../../hooks/useNotifications";
import { TrashIcon, PlusIcon } from "../../icons";

interface CouponGridProps {
  onAddCoupon: () => void;
}

export const CouponGrid = ({ onAddCoupon }: CouponGridProps) => {
  // Hooks를 직접 사용
  const { addNotification } = useNotifications();
  const couponHandlers = useCouponHandlers({ addNotification });

  const handleDeleteCoupon = (code: string) => {
    couponHandlers.actions.remove(code);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {couponHandlers.state.items.map((coupon) => (
            <div
              key={coupon.id}
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
                  onClick={() => handleDeleteCoupon(coupon.code)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={onAddCoupon}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
