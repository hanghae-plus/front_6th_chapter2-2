import { CouponAddButton } from './CouponAddButton';
import { CouponForm } from './CouponForm';
import { CouponList } from './CouponList';
import type { Coupon } from '../../../types';
import type { NotificationVariant } from '../../constants';
import { useCouponForm } from '../../hooks/useCouponForm';

interface CouponTabProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;
  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function CouponTab({
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  onAddNotification,
}: CouponTabProps) {
  const {
    showCouponForm,
    couponFormData,
    updateCouponFormData,
    handleCouponSubmit,
    handleShowCouponForm,
    handleHideCouponForm,
  } = useCouponForm({
    onAddCoupon,
    onAddNotification,
  });

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <CouponList coupons={coupons} onDelete={onDeleteCoupon} />

          <CouponAddButton onAddNew={handleShowCouponForm} />
        </div>

        <CouponForm
          isOpen={showCouponForm}
          form={couponFormData}
          updateForm={updateCouponFormData}
          onSubmit={handleCouponSubmit}
          onCancel={handleHideCouponForm}
          onAddNotification={onAddNotification}
        />
      </div>
    </section>
  );
}
