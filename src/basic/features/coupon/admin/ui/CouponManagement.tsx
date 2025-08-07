import { useState } from 'react';
import { Coupon } from '../../../../../types';
import { useCoupons } from '../../../../entities/coupon/hooks';
import CouponTable from './CouponTable';
import CouponForm from './CouponForm';

interface CouponManagementProps {
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}

export function CouponManagement({
  coupons,
  setCoupons,
  addNotification,
}: CouponManagementProps) {
  const { addCoupon, deleteCoupon } = useCoupons({
    coupons,
    setCoupons,
    selectedCoupon: null, // Admin에서는 쿠폰 선택 불필요
    setSelectedCoupon: () => {}, // Admin에서는 쿠폰 선택 불필요
    addNotification,
    calculateCartTotalWithCoupon: () => ({
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
    }),
  });

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
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
}
