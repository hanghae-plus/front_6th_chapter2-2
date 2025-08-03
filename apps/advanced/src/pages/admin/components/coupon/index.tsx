import { Coupon } from '@/models/coupon';
import { useState } from 'react';
import CouponForm from './coupon-form';
import CouponList from './coupon-list';

type Props = {
  coupons: Coupon[];
  couponForm: Omit<Coupon, 'id'>;
  onUpdateForm: (form: Omit<Coupon, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (code: string) => void;
};

const CouponSection = ({
  coupons,
  couponForm,
  onUpdateForm,
  onSubmit,
  onDelete
}: Props) => {
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <CouponList coupons={coupons} onDelete={onDelete} />

          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className='text-gray-400 hover:text-gray-600 flex flex-col items-center'>
              <svg
                className='w-8 h-8'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onSubmit={onSubmit}
            onCancel={() => setShowCouponForm(false)}
            onUpdateForm={onUpdateForm}
          />
        )}
      </div>
    </section>
  );
};

export default CouponSection;
