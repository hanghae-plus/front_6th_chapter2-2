import { useAtom, useSetAtom } from 'jotai';

import { cartAtom, couponsAtom, pushNotificationAtom, selectedCouponAtom } from '../../store/atoms';
import { calculateCartTotal, validateCouponUsage } from '../../utils/calculator';
import { formatPrice } from '../../utils/formatters';

export default function CouponSection() {
  const [coupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [cart] = useAtom(cartAtom);

  const pushNotification = useSetAtom(pushNotificationAtom);

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value) || null;
    if (!coupon) {
      setSelectedCoupon(null);
      return;
    }

    const currentTotal = calculateCartTotal(cart).totalAfterDiscount;
    if (!validateCouponUsage(coupon, currentTotal)) {
      pushNotification({
        message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
        type: 'error',
      });
      return;
    }
    setSelectedCoupon(coupon);
    pushNotification({ message: '쿠폰이 적용되었습니다.', type: 'success' });
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
        <button className='text-xs text-blue-600 hover:underline'>쿠폰 등록</button>
      </div>
      {coupons.length > 0 && (
        <select
          className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
          value={selectedCoupon?.code || ''}
          onChange={handleCouponChange}
        >
          <option value=''>쿠폰 선택</option>
          {coupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} (
              {coupon.discountType === 'amount'
                ? `${formatPrice(coupon.discountValue)}`
                : `${coupon.discountValue}%`}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
}
