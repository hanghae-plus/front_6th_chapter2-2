import { useCoupons, useDeleteCoupon } from '../../../hooks/useCoupons';
import { TabTitle } from '../ui/TabTitle';
import { CouponCard } from './CouponCard';
import { CouponsForm } from './CouponsForm';
import { useCouponsForm } from './hooks/useCouponsForm';
import { ShowCouponFormCard } from './ShowCouponFormCard';

export function CouponsTab() {
  const coupons = useCoupons();
  const deleteCoupon = useDeleteCoupon();
  const {
    showCouponForm,
    couponForm,
    handleSubmitCouponForm,
    closeCouponForm,
    openCouponForm,
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleDiscountValueBlur,
    getDisplayValue,
    getDiscountLabel,
    getDiscountPlaceholder,
  } = useCouponsForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <TabTitle>쿠폰 관리</TabTitle>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onClickDelete={deleteCoupon}
            />
          ))}

          <ShowCouponFormCard onClick={openCouponForm} />
        </div>

        {showCouponForm && (
          <CouponsForm
            couponForm={couponForm}
            onSubmit={handleSubmitCouponForm}
            onClickCancel={closeCouponForm}
            handleNameChange={handleNameChange}
            handleCodeChange={handleCodeChange}
            handleDiscountTypeChange={handleDiscountTypeChange}
            handleDiscountValueChange={handleDiscountValueChange}
            handleDiscountValueBlur={handleDiscountValueBlur}
            getDisplayValue={getDisplayValue}
            getDiscountLabel={getDiscountLabel}
            getDiscountPlaceholder={getDiscountPlaceholder}
          />
        )}
      </div>
    </section>
  );
}
