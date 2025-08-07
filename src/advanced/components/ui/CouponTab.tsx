import { CouponAddButton } from './CouponAddButton';
import { CouponForm } from './CouponForm';
import { CouponList } from './CouponList';
import { Coupon } from '../../../types';
import { useCouponFormVisibility, useAdminCouponService } from '../../features/coupon-management';

export function CouponTab() {
  const { onAddCoupon, onDeleteCoupon } = useAdminCouponService();
  const { isVisible, handleShowCouponForm, handleHideCouponForm } = useCouponFormVisibility();

  const onCouponSubmit = (form: Coupon) => {
    onAddCoupon(form);
    handleHideCouponForm();
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <CouponList onDelete={onDeleteCoupon} />

          <CouponAddButton onAddNew={handleShowCouponForm} />
        </div>

        {isVisible && <CouponForm onSubmit={onCouponSubmit} onCancel={handleHideCouponForm} />}
      </div>
    </section>
  );
}
