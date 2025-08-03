import { useState, useCallback } from "react";
import { Coupon } from "../../../../types";
import PlusIcon from "../../../assets/icons/PlusIcon.svg?react";
import { NotificationVariant } from "../../../entities/notification/types";
import { CouponCard } from "../../../entities/coupon/ui/CouponCard";
import { AddCouponForm } from "../../../features/add-coupon/ui/AddCouponForm";

interface CouponsTabProps {
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  addNotification: (message: string, variant?: NotificationVariant) => void;
}

export function CouponsTab({
  coupons,
  setCoupons,
  addNotification,
}: CouponsTabProps) {
  const [showCouponForm, setShowCouponForm] = useState(false);

  const addCoupon = useCallback(
    (newCoupon: Omit<Coupon, "id">) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification(
          "이미 존재하는 쿠폰 코드입니다.",
          NotificationVariant.ERROR
        );
        return;
      }
      const couponWithId = { ...newCoupon, id: Date.now().toString() };
      setCoupons([...coupons, couponWithId]);
      addNotification("쿠폰이 추가되었습니다.", NotificationVariant.SUCCESS);
    },
    [coupons, setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(coupons.filter((c) => c.code !== couponCode));
      addNotification("쿠폰이 삭제되었습니다.", NotificationVariant.SUCCESS);
    },
    [coupons, setCoupons, addNotification]
  );

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onDelete={deleteCoupon}
            />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <AddCouponForm
            onSubmit={addCoupon}
            onCancel={() => setShowCouponForm(false)}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
}
