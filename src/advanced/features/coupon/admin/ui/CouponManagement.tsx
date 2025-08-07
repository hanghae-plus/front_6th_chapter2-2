import { useState } from 'react';
import CouponTable from './CouponTable';
import CouponForm from './CouponForm';
import { useCoupons } from '../../../../entities/coupon/hooks/useCoupons';

export default function CouponManagement() {
  const { coupons, addCoupon, deleteCoupon } = useCoupons();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const handleCouponSubmit = () => {
    addCoupon(couponForm);
    resetForm();
  };

  const resetForm = () => {
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startAddCoupon = () => {
    setShowCouponForm(true);
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>

      <div className='p-6'>
        <CouponTable
          coupons={coupons}
          onDelete={deleteCoupon}
          onAddNew={startAddCoupon}
        />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            onSubmit={handleCouponSubmit}
            onCancel={resetForm}
          />
        )}
      </div>
    </section>
  );
}
