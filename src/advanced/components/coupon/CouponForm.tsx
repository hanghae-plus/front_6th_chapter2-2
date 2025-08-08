import { Button } from '../../../shared/components';
import { useCouponList } from '../../hooks/admin';
import { ChangeEvent, FocusEvent, FormEvent } from 'react';

interface CouponFormProps {
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export function CouponForm({ addNotification }: CouponFormProps) {
  const {
    couponForm,
    handleCouponFormChange,
    handleFormSubmit,
    validateCouponForm,
    resetCouponForm: handleResetCouponForm,
  } = useCouponList();

  const handleDiscountValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      handleCouponFormChange({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleDiscountValueBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const validation = validateCouponForm('discountValue', value);

    if (!validation.isValid && validation.message) {
      addNotification(validation.message, 'error');

      // Auto-correct to max/min values
      if (couponForm.discountType === 'percentage') {
        if (value > 100) {
          handleCouponFormChange({ ...couponForm, discountValue: 100 });
        } else if (value < 0) {
          handleCouponFormChange({ ...couponForm, discountValue: 0 });
        }
      } else {
        if (value > 100000) {
          handleCouponFormChange({ ...couponForm, discountValue: 100000 });
        } else if (value < 0) {
          handleCouponFormChange({ ...couponForm, discountValue: 0 });
        }
      }
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form
        onSubmit={(e: FormEvent) => {
          const { success } = handleFormSubmit(e);
          if (success) {
            addNotification('쿠폰이 생성되었습니다.', 'success');
          }
        }}
        className="space-y-4"
      >
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) => handleCouponFormChange({ ...couponForm, name: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드</label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) =>
                handleCouponFormChange({
                  ...couponForm,
                  code: e.target.value.toUpperCase(),
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                handleCouponFormChange({
                  ...couponForm,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            </label>
            <input
              type="text"
              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
              onChange={handleDiscountValueChange}
              onBlur={handleDiscountValueBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={handleResetCouponForm} variant="secondary">
            취소
          </Button>
          <Button type="submit" variant="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
