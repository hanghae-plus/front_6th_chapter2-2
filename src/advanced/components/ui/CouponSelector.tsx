import { useAtomValue } from 'jotai';

import type { Coupon } from '../../../types';
import { couponsAtom } from '../../entities/coupon';

interface CouponSelectorProps {
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onResetSelectedCoupon: () => void;
}

export function CouponSelector({
  selectedCoupon,
  onApplyCoupon,
  onResetSelectedCoupon,
}: CouponSelectorProps) {
  const coupons = useAtomValue(couponsAtom);
  const hasCoupons = coupons.length > 0;

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
        <button className='text-xs text-blue-600 hover:underline'>쿠폰 등록</button>
      </div>
      {hasCoupons && (
        <select
          className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
          value={selectedCoupon?.code || ''}
          onChange={(e) => {
            const coupon = coupons.find((c) => c.code === e.target.value);
            if (coupon) onApplyCoupon(coupon);
            else onResetSelectedCoupon();
          }}
        >
          <option value=''>쿠폰 선택</option>
          {coupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} (
              {coupon.discountType === 'amount'
                ? `${coupon.discountValue.toLocaleString()}원`
                : `${coupon.discountValue}%`}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
}
