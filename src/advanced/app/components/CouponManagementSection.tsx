import {
  AddCouponCard,
  CouponCard,
  CouponForm,
  useCouponAtom,
  useCouponForm
} from "../../domains/coupon";

export function CouponManagementSection() {
  const { coupons, deleteCoupon } = useCouponAtom();
  const {
    couponForm,
    showCouponForm,
    setCouponForm,
    handleSubmit,
    handleToggleForm,
    handleCancel
  } = useCouponForm();

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} onDelete={deleteCoupon} />
          ))}
          <AddCouponCard onClick={handleToggleForm} />
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onFormChange={setCouponForm}
          />
        )}
      </div>
    </section>
  );
}
