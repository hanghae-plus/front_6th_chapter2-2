import { useState, useCallback } from 'react';
import { Coupon } from '../../../../types';
import { MESSAGES } from '../../../constants/messages';
import { PlusIcon } from '../../icons';
import CouponCard from './CouponCard';
import CouponForm from './CouponForm';

interface CouponTabProps {
  // coupon
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;

  // notification
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

const CouponTab = ({
  coupons,
  addCoupon,
  deleteCoupon,
  selectedCoupon,
  setSelectedCoupon,
  addNotification,
}: CouponTabProps) => {
  // 쿠폰 추가 (수정) 폼 표시
  const [showCouponForm, setShowCouponForm] = useState(false);

  // 쿠폰 삭제
  const deleteCouponItem = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification(MESSAGES.COUPON.DELETED, 'success');
    },
    [selectedCoupon, addNotification],
  );

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {/* 기존 쿠폰 목록 */}
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} deleteCoupon={deleteCouponItem} />
          ))}

          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
            >
              {/* 새 쿠폰 추가 + 아이콘 */}
              <PlusIcon />
              <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            coupons={coupons}
            setShowCouponForm={setShowCouponForm}
            addCoupon={addCoupon}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponTab;
