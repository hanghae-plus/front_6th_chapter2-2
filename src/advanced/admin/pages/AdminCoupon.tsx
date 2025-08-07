import { useState } from 'react';
import { Coupon } from '../../shared/types';
import { CouponItem } from '../components/coupon/CouponItem';
import { initialCouponForm } from '../../shared/constants';
import { CouponForm } from '../components/coupon/CouponForm';
import { useCoupon } from '../../shared/hooks/useCoupon';

export const AdminCoupon = () => {
  const { coupons, deleteCoupon } = useCoupon();

  const [couponForm, setCouponForm] = useState<Coupon>(initialCouponForm);
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map(coupon => (
            <CouponItem
              key={coupon.code}
              coupon={coupon}
              deleteCoupon={deleteCoupon}
            />
          ))}

          {/* 새 쿠폰 추가 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            setShowCouponForm={setShowCouponForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
          />
        )}
      </div>
    </section>
  );
};
