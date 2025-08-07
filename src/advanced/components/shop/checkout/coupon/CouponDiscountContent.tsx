import React from 'react';
import Button from '../../../ui/Button.tsx';
import Select from '../../../ui/Select.tsx';
import { useAtomValue } from 'jotai';
import {
  applyCouponAtom,
  couponsAtom,
  resetCouponAtom,
  selectedCouponAtom,
} from '../../../../store/entities/coupon.store.ts';
import { useSetAtom } from 'jotai/index';

const CouponDiscountContent = () => {
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const applyCoupon = useSetAtom(applyCouponAtom);
  const resetCoupon = useSetAtom(resetCouponAtom);

  const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find(c => c.code === e.target.value);
    if (coupon) applyCoupon(coupon);
    else resetCoupon();
  };
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <Button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </Button>
      </div>
      {coupons.length > 0 && (
        <Select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ''}
          items={coupons}
          defaultText={'쿠폰 선택'}
          getLabel={coupon =>
            `${coupon.name} (${coupon.discountValue}${coupon.discountType === 'amount' ? '원' : '%'})`
          }
          getValue={coupon => `${coupon.code}`}
          onChange={handleChangeOption}
        />
      )}
    </>
  );
};

export default CouponDiscountContent;
