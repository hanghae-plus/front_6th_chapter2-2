import { useAtomValue } from 'jotai';

import { couponsAtom } from '../../../entities/coupon';
import { Icon } from '../../../shared/icon';

interface CouponListProps {
  onDelete: (couponCode: string) => void;
}

export function CouponList({ onDelete }: CouponListProps) {
  const coupons = useAtomValue(couponsAtom);

  if (coupons.length === 0) {
    return null;
  }

  return coupons.map((coupon) => (
    <div
      key={coupon.code}
      className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'
    >
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-900'>{coupon.name}</h3>
          <p className='text-sm text-gray-600 mt-1 font-mono'>{coupon.code}</p>
          <div className='mt-2'>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700'>
              {coupon.discountType === 'amount'
                ? `${coupon.discountValue.toLocaleString()}원 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(coupon.code)}
          className='text-gray-400 hover:text-red-600 transition-colors'
        >
          <Icon name='trash' width={20} height={20} />
        </button>
      </div>
    </div>
  ));
}
