import { FormEvent } from 'react';
import { Button } from '../../../../shared/ui';
import { useNotification } from '../../../../shared/utils';

interface CouponFormData {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

interface CouponFormProps {
  couponForm: CouponFormData;
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CouponForm({
  couponForm,
  setCouponForm,
  onSubmit,
  onCancel,
}: CouponFormProps) {
  const { addNotification } = useNotification();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleDiscountValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (couponForm.discountType === 'percentage') {
      if (value > 100) {
        addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
        setCouponForm({
          ...couponForm,
          discountValue: 100,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    } else {
      if (value > 100000) {
        addNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
        setCouponForm({
          ...couponForm,
          discountValue: 100000,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    }
  };

  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              쿠폰명
            </label>
            <input
              type='text'
              value={couponForm.name}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  name: e.target.value,
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
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  code: e.target.value.toUpperCase(),
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
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
            >
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
              onChange={handleDiscountValueChange}
              onBlur={handleDiscountValueBlur}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button type='button' onClick={onCancel} variant='ghost' size='md'>
            취소
          </Button>
          <Button type='submit' variant='secondary' size='md'>
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
