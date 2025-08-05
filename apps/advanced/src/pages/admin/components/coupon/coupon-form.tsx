import {
  Coupon,
  isMaxAmountCoupon,
  isMaxPercentageCoupon,
  isMinAmountCoupon,
  isMinPercentageCoupon
} from '@/models/coupon';
import { discountTypeSchema } from '@/models/discount';
import { notificationTypeSchema } from '@/models/notification';
import { useNotificationService } from '@/services';
import { Button, InputField } from '@/shared/ui';
import { FormEvent } from 'react';

type Props = {
  couponForm: Omit<Coupon, 'id'>;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  onUpdateForm: (form: Omit<Coupon, 'id'>) => void;
};

const CouponForm = ({
  couponForm,
  onSubmit,
  onCancel,
  onUpdateForm
}: Props) => {
  const { addNotification } = useNotificationService();

  const handleChangeCouponName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdateForm({ ...couponForm, name: event.target.value });
  };

  const handleChangeCouponCode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdateForm({ ...couponForm, code: event.target.value.toUpperCase() });
  };

  const handleChangeCouponDiscountRate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onUpdateForm({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value)
      });
    }
  };

  const handleFocusCouponDiscountRate = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const value = parseInt(event.target.value) || 0;

    if (isMaxPercentageCoupon(couponForm.discountType, value)) {
      onUpdateForm({ ...couponForm, discountValue: 100 });
      addNotification(
        '할인율은 100%를 초과할 수 없습니다',
        notificationTypeSchema.enum.error
      );
    } else if (isMinAmountCoupon(couponForm.discountType, value)) {
      onUpdateForm({ ...couponForm, discountValue: 0 });
    } else if (isMaxAmountCoupon(couponForm.discountType, value)) {
      onUpdateForm({ ...couponForm, discountValue: 100000 });
      addNotification(
        '할인 금액은 100,000원을 초과할 수 없습니다',
        notificationTypeSchema.enum.error
      );
    } else if (isMinPercentageCoupon(couponForm.discountType, value)) {
      onUpdateForm({ ...couponForm, discountValue: 0 });
    }
  };

  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <InputField
            label='쿠폰명'
            value={couponForm.name}
            onChange={handleChangeCouponName}
            placeholder='신규 가입 쿠폰'
            required
          />
          <InputField
            label='쿠폰 코드'
            value={couponForm.code}
            onChange={handleChangeCouponCode}
            placeholder='WELCOME2024'
            required
          />
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={e =>
                onUpdateForm({
                  ...couponForm,
                  discountType: discountTypeSchema.parse(e.target.value)
                })
              }
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'>
              <option value='amount'>정액 할인</option>
              <option value='percentage'>정률 할인</option>
            </select>
          </div>
          <InputField
            label={
              couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'
            }
            value={couponForm.discountValue}
            onChange={handleChangeCouponDiscountRate}
            onBlur={handleFocusCouponDiscountRate}
            placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
            required
          />
        </div>
        <div className='flex justify-end gap-3'>
          <Button type='button' variant='secondary' onClick={onCancel}>
            취소
          </Button>
          <Button
            type='submit'
            variant='secondary'
            className='text-white bg-indigo-600 hover:bg-indigo-700'
            onClick={onCancel}>
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
