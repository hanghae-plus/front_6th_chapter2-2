import { Coupon } from "../../../../types";
import { useCouponForm } from "../../../../hooks/admin/useCouponForm";
import { CouponList } from "./CouponList";
import { CouponForm } from "./CouponForm";

interface CouponTabProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;
}

export function CouponTab({
  coupons,
  onAddCoupon,
  onDeleteCoupon,
}: CouponTabProps) {
  const {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    handleCouponSubmit,
  } = useCouponForm();

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
