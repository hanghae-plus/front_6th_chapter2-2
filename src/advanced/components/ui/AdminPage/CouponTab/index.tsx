import { Coupon } from "../../../../types";
import { useCouponForm } from "../../../../hooks/admin/useCouponForm";
import { CouponList } from "./CouponList";
import { CouponForm } from "./CouponForm";
import { useAtomValue } from "jotai";
import { couponsAtom } from "../../../../atoms";

interface CouponTabProps {
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;
}

export function CouponTab({ onAddCoupon, onDeleteCoupon }: CouponTabProps) {
  const {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    handleCouponSubmit,
  } = useCouponForm();
  const coupons = useAtomValue(couponsAtom);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          coupons={coupons}
          onDeleteCoupon={onDeleteCoupon}
          onAddCouponClick={() => setShowCouponForm(!showCouponForm)}
        />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            onSubmit={(e) => handleCouponSubmit(e, onAddCoupon)}
            onCancel={() => setShowCouponForm(false)}
          />
        )}
      </div>
    </section>
  );
}
