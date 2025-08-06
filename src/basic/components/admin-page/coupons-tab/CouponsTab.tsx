import { useState, type FormEvent } from 'react';
import type { Coupon } from '../../../../types';
import { TabTitle } from '../ui/TabTitle';
import { CouponCard } from './CouponCard';
import { CouponsForm, type CouponForm } from './CouponsForm';
import { ShowCouponFormCard } from './ShowCouponFormCard';

interface Props {
  coupons: Coupon[];
  addCoupon: (params: { newCoupon: Coupon }) => void;
  deleteCoupon: (params: { couponCode: string }) => void;
  addNotification: (params: {
    message: string;
    type?: 'error' | 'success' | 'warning';
  }) => void;
}

export function CouponsTab({
  coupons,
  addCoupon,
  deleteCoupon,
  addNotification,
}: Props) {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  const handleCouponSubmit = (e: FormEvent) => {
    e.preventDefault();
    addCoupon({
      newCoupon: couponForm,
    });
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

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

          <ShowCouponFormCard
            onClick={() => setShowCouponForm(!showCouponForm)}
          />
        </div>

        {showCouponForm && (
          <CouponsForm
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            onSubmit={handleCouponSubmit}
            addNotification={addNotification}
            setShowCouponForm={setShowCouponForm}
          />
        )}
      </div>
    </section>
  );
}
