import { CouponForm } from '../../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface CouponsManagementProps {
  couponForm: CouponForm;
  onToggleForm: (show: boolean) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onCouponFormChange: (form: CouponForm) => void;
  onNotify: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export default function CouponsForm({
  couponForm,
  onCouponSubmit,
  onCouponFormChange,
  onNotify,
  onToggleForm,
}: CouponsManagementProps) {
  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={onCouponSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>쿠폰명</label>
            <Input
              type='text'
              value={couponForm.name}
              onChange={(e) => onCouponFormChange({ ...couponForm, name: e.target.value })}
              className='text-sm'
              placeholder='신규 가입 쿠폰'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>쿠폰 코드</label>
            <Input
              type='text'
              value={couponForm.code}
              onChange={(e) =>
                onCouponFormChange({ ...couponForm, code: e.target.value.toUpperCase() })
              }
              className='text-sm font-mono'
              placeholder='WELCOME2024'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                onCouponFormChange({
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
            <Input
              type='text'
              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  onCouponFormChange({
                    ...couponForm,
                    discountValue: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (couponForm.discountType === 'percentage') {
                  if (value > 100) {
                    onNotify('할인율은 100%를 초과할 수 없습니다', 'error');
                    onCouponFormChange({ ...couponForm, discountValue: 100 });
                  } else if (value < 0) {
                    onCouponFormChange({ ...couponForm, discountValue: 0 });
                  }
                } else {
                  if (value > 100000) {
                    onNotify('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
                    onCouponFormChange({ ...couponForm, discountValue: 100000 });
                  } else if (value < 0) {
                    onCouponFormChange({ ...couponForm, discountValue: 0 });
                  }
                }
              }}
              size='md'
              className='text-sm'
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button type='button' onClick={() => onToggleForm(false)} variant='outline'>
            취소
          </Button>
          <Button type='submit' variant='primary' className='bg-indigo-600 text-white'>
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
