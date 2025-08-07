import { useAtom } from 'jotai';
import { useState } from 'react';

import { CouponForm as CouponFormType } from '../../../types';
import { defaultCouponForm } from '../../constants';
import { formatCouponDisplay } from '../../models/coupon';
import { addCouponAtom, removeCouponAtom } from '../../store/actions';
import { TrashIcon, PlusIcon } from '../icons';
import CouponForm from './CouponForm';
import { couponsAtom, selectedCouponAtom } from '../../store/atoms';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

const CouponManagement = () => {
  const [coupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [, addCoupon] = useAtom(addCouponAtom);
  const [, removeCoupon] = useAtom(removeCouponAtom);

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponFormType>(defaultCouponForm);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      newCoupon: couponForm,
    });
    setCouponForm(defaultCouponForm);
    setShowCouponForm(false);
  };

  const handleRemoveCoupon = (couponCode: string) => {
    removeCoupon({
      couponCode,
    });
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
  };

  return (
    <Card
      padding='md'
      headerStyle='border'
      contentPadding={false}
      header={<h2 className='text-lg font-semibold'>쿠폰 관리</h2>}
    >
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'
            >
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900'>{coupon.name}</h3>
                  <p className='text-sm text-gray-600 mt-1 font-mono'>{coupon.code}</p>
                  <div className='mt-2'>
                    <Badge
                      size='sm'
                      rounded='full'
                      className='inline-flex items-center px-3 py-1 font-medium bg-white text-indigo-700'
                    >
                      {formatCouponDisplay(coupon)}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  hasTransition
                  className='text-gray-400 hover:text-red-600'
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}

          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
            <Button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
            >
              <PlusIcon />
              <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
            </Button>
          </div>
        </div>

        <CouponForm
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          handleCouponSubmit={handleCouponSubmit}
        />
      </div>
    </Card>
  );
};

export default CouponManagement;
