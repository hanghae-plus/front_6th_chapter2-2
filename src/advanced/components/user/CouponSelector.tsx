import { CartItem as CartItemType, Coupon } from '../../../types';
import Button from '../ui/Button';

interface CouponSelectorProps {
  coupons: Coupon[];
  cart: CartItemType[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon, cart: CartItemType[]) => void;
  onSelectedCouponChange: (coupon: Coupon | null) => void;
}

export default function CouponSelector({
  coupons,
  cart,
  selectedCoupon,
  onApplyCoupon,
  onSelectedCouponChange,
}: CouponSelectorProps) {
  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
        <Button variant='link' className='text-xs'>
          쿠폰 등록
        </Button>
      </div>
      {coupons.length > 0 && (
        <select
          className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
          value={selectedCoupon?.code || ''}
          onChange={(e) => {
            const coupon = coupons.find((c) => c.code === e.target.value);

            coupon ? onApplyCoupon(coupon, cart) : onSelectedCouponChange(null);
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
