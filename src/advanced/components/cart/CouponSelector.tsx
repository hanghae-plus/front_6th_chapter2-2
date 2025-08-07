import { useAtom } from 'jotai';
import { Coupon } from '../../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Selector';
import { couponsAtom, selectedCouponAtom } from '../../store/atoms';
import { applyCouponAtom } from '../../store/actions';

const CouponSelector = () => {
  const [coupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [, applyCoupon] = useAtom(applyCouponAtom);

  const handleApplyCoupon = (coupon: Coupon) => {
    applyCoupon({
      coupon,
      onNotification: () => {
        // 알림은 이미 applyCouponAtom 내부에서 처리됨
      },
    });
  };

  return (
    <Card
      padding='sm'
      headerStyle='margin'
      header={
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
          <Button className='text-xs text-blue-600 hover:underline'>쿠폰 등록</Button>
        </div>
      }
    >
      {coupons.length > 0 && (
        <Select
          focusStyle='blue'
          value={selectedCoupon?.code || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const coupon = coupons.find((c) => c.code === e.target.value);
            if (coupon) handleApplyCoupon(coupon);
            else setSelectedCoupon(null);
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
        </Select>
      )}
    </Card>
  );
};

export default CouponSelector;
