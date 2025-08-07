import { Coupon } from '@/models/coupon';
import { discountTypeSchema } from '@/models/discount';
import { notificationTypeSchema } from '@/models/notification';
import { useNotificationService } from '@/services';
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
  const notificationService = useNotificationService();

  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              쿠폰명
            </label>
            <input
              type='text'
              value={couponForm.name}
              onChange={e =>
                onUpdateForm({
                  ...couponForm,
                  name: e.target.value
                })
              }
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
              placeholder='신규 가입 쿠폰'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              쿠폰 코드
            </label>
            <input
              type='text'
              value={couponForm.code}
              onChange={e =>
                onUpdateForm({
                  ...couponForm,
                  code: e.target.value.toUpperCase()
                })
              }
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono'
              placeholder='WELCOME2024'
              required
            />
          </div>
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
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            </label>
            <input
              type='text'
              value={
                couponForm.discountValue === 0 ? '' : couponForm.discountValue
              }
              onChange={e => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  onUpdateForm({
                    ...couponForm,
                    discountValue: value === '' ? 0 : parseInt(value)
                  });
                }
              }}
              onBlur={e => {
                const value = parseInt(e.target.value) || 0;
                if (couponForm.discountType === 'percentage') {
                  if (value > 100) {
                    notificationService.addNotification(
                      '할인율은 100%를 초과할 수 없습니다',
                      notificationTypeSchema.enum.error
                    );
                    onUpdateForm({
                      ...couponForm,
                      discountValue: 100
                    });
                  } else if (value < 0) {
                    onUpdateForm({
                      ...couponForm,
                      discountValue: 0
                    });
                  }
                } else {
                  if (value > 100000) {
                    notificationService.addNotification(
                      '할인 금액은 100,000원을 초과할 수 없습니다',
                      notificationTypeSchema.enum.error
                    );
                    onUpdateForm({
                      ...couponForm,
                      discountValue: 100000
                    });
                  } else if (value < 0) {
                    onUpdateForm({
                      ...couponForm,
                      discountValue: 0
                    });
                  }
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'>
            취소
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'>
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
