import { Button } from '../../../shared/components';

interface CouponFormData {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

interface CouponFormProps {
  couponForm: CouponFormData;
  onFormChange: (form: CouponFormData) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onFormReset: () => void;
  onFormValidate: (
    field: keyof CouponFormData,
    value: any
  ) => { isValid: boolean; message?: string };
  onAddNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export function CouponForm({
  couponForm,
  onFormChange,
  onFormSubmit,
  onFormReset,
  onFormValidate,
  onAddNotification,
}: CouponFormProps) {
  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onFormChange({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const validation = onFormValidate('discountValue', value);

    if (!validation.isValid && validation.message) {
      onAddNotification(validation.message, 'error');

      // Auto-correct to max/min values
      if (couponForm.discountType === 'percentage') {
        if (value > 100) {
          onFormChange({ ...couponForm, discountValue: 100 });
        } else if (value < 0) {
          onFormChange({ ...couponForm, discountValue: 0 });
        }
      } else {
        if (value > 100000) {
          onFormChange({ ...couponForm, discountValue: 100000 });
        } else if (value < 0) {
          onFormChange({ ...couponForm, discountValue: 0 });
        }
      }
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onFormSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) => onFormChange({ ...couponForm, name: e.target.value })}
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
                onFormChange({
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
                onFormChange({
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
          <Button type="button" onClick={onFormReset} variant="secondary">
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
