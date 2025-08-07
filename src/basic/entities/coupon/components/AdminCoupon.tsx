import { CouponType } from '@/types';
import { useCouponForm } from '../hooks/useCouponForm';
import { AdminCouponCard } from './AdminCouponCard';
import { AdminCouponForm } from './AdminCouponForm';
import { useCoupon } from '../hooks/useCoupon';
import { Dispatch, SetStateAction } from 'react';

interface AdminCouponPropsType {
  coupons: CouponType[];
  setCoupons: Dispatch<SetStateAction<CouponType[]>>;
  addNotification: (message: string, type: 'success' | 'error') => void;
}

export const AdminCoupon = ({ coupons, setCoupons, addNotification }: AdminCouponPropsType) => {
  const { addCoupon, deleteCoupon } = useCoupon({
    coupons,
    setCoupons,
    addNotification,
  });

  const { showCouponForm, setShowCouponForm, couponForm, setCouponForm, handleCouponSubmit } =
    useCouponForm(addCoupon);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <AdminCouponCard
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
        />

        {showCouponForm && (
          <AdminCouponForm
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            handleCouponSubmit={handleCouponSubmit}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};
