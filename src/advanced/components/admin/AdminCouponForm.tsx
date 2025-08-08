import { useAtomValue, useSetAtom } from 'jotai';

import {
  couponFormAtom,
  handleCouponFormSubmitAtom,
  updateCouponFormAtom,
  updateShowCouponFormAtom,
} from '../../atoms/formAtoms';
import { addNotificationAtom } from '../../atoms/notificationAtoms';

const AdminCouponForm = () => {
  // atoms 직접 사용
  const couponForm = useAtomValue(couponFormAtom);

  // action atoms
  const handleCouponSubmitAction = useSetAtom(handleCouponFormSubmitAtom);
  const updateCouponFormAction = useSetAtom(updateCouponFormAtom);
  const updateShowCouponFormAction = useSetAtom(updateShowCouponFormAtom);
  const addNotificationAction = useSetAtom(addNotificationAtom);

  const handleCouponSubmit = (e: React.FormEvent) => {
    handleCouponSubmitAction(e);
  };

  const updateCouponForm = (updates: any) => {
    updateCouponFormAction(updates);
  };

  const updateShowCouponForm = (show: boolean) => {
    updateShowCouponFormAction(show);
  };

  const addNotification = (message: string, type: any) => {
    addNotificationAction({
      id: Date.now().toString(),
      message,
      type,
    });
  };

  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={handleCouponSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>쿠폰명</label>
            <input
              type='text'
              value={couponForm.name}
              onChange={(e) => updateCouponForm({ name: e.target.value })}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
              placeholder='신규 가입 쿠폰'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>쿠폰 코드</label>
            <input
              type='text'
              value={couponForm.code}
              onChange={(e) => updateCouponForm({ code: e.target.value.toUpperCase() })}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono'
              placeholder='WELCOME2024'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                updateCouponForm({
                  ...couponForm,
                  discountType: e.target.value as 'amount' | 'percentage',
                  discountValue: 0,
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
              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
              onChange={(e) => {
                const { value } = e.target;

                if (value === '') {
                  updateCouponForm({ discountValue: 0 });
                  return;
                }

                if (couponForm.discountType === 'percentage') {
                  // percentage 타입에서는 일단 모든 숫자를 허용하고 blur에서 검증
                  if (/^\d*\.?\d*$/.test(value)) {
                    const numValue = parseFloat(value);
                    updateCouponForm({ discountValue: numValue });
                  }
                } else {
                  if (/^\d+$/.test(value)) {
                    updateCouponForm({ discountValue: parseInt(value) });
                  }
                }
              }}
              onBlur={(e) => {
                const { value } = e.target;
                if (value === '') {
                  updateCouponForm({ discountValue: 0 });
                } else if (couponForm.discountType === 'percentage') {
                  const numValue = parseFloat(value);
                  if (numValue < 0 || numValue > 100) {
                    addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
                    updateCouponForm({ discountValue: 0 });
                  }
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>

        <div className='flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => updateShowCouponForm(false)}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            취소
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
};

export { AdminCouponForm };
