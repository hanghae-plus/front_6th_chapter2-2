// src/basic/components/CouponAdmin.tsx
import React, { useState } from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { CouponForm } from './CouponForm';
import { useCoupons } from '../hooks/useCoupons';

export const CouponAdmin = () => {
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const [showCouponForm, setShowCouponForm] = useState(false);

  const handleAddCoupon = (coupon) => {
    addCoupon(coupon);
    setShowCouponForm(false);
  }

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {coupons.map(coupon => (
            <div
              key={coupon.code}
              className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'
            >
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900'>
                    {coupon.name}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1 font-mono'>
                    {coupon.code}
                  </p>
                  <div className='mt-2'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700'>
                      {coupon.discountType === 'amount'
                        ? `${coupon.discountValue.toLocaleString()}원 할인`
                        : `${coupon.discountValue}% 할인`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeCoupon(coupon.code)}
                  className='text-gray-400 hover:text-red-600 transition-colors'
                  aria-label={`${coupon.name} 삭제`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}

          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
            <button
              onClick={() => setShowCouponForm(true)}
              className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
            >
              <svg
                className='w-8 h-8'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
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
            onAddCoupon={handleAddCoupon}
            onCancel={() => setShowCouponForm(false)}
          />
        )}
      </div>
    </section>
  )
}
