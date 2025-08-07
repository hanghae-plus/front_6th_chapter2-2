import React from 'react';
import { useAtom } from 'jotai';
import { couponsAtom } from '../../../atoms/couponAtoms';
import { CouponCard, AddCouponButton, CouponForm } from './coupon';
import { showCouponFormAtom } from '../../../atoms/uiAtoms';
import { useCoupon } from '../../../hooks/useCoupon';
import { useCouponForm } from '../../../hooks/useCouponForm';

export const CouponManagement: React.FC = () => {
  const [coupons] = useAtom(couponsAtom);
  const [showCouponForm, setShowCouponForm] = useAtom(showCouponFormAtom);

  const { onRemoveCoupon, onAddCoupon } = useCoupon();
  const { setCouponForm, couponForm } = useCouponForm();

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCoupon(couponForm);
    setCouponForm({
      id: '',
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const handleCancel = () => {
    setShowCouponForm(false);
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {coupons.map(coupon => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onRemove={onRemoveCoupon}
            />
          ))}
          <AddCouponButton onClick={() => setShowCouponForm(!showCouponForm)} />
        </div>

        {showCouponForm && (
          <CouponForm onSubmit={handleCouponSubmit} onCancel={handleCancel} />
        )}
      </div>
    </section>
  );
};
