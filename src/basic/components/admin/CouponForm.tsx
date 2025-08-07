import type { CouponFormData as CouponFormDataType } from '../../../types';

interface CouponFormProps {
  couponForm: CouponFormDataType;
  updateName: (name: string) => void;
  updateCode: (code: string) => void;
  updateDiscountType: (discountType: 'amount' | 'percentage') => void;
  updateDiscountValue: (value: string) => void;
  validateDiscountValue: (value: string, onError: (message: string) => void) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
  toggleCouponForm: () => void;
}

export function CouponForm({
  couponForm,
  updateName,
  updateCode,
  updateDiscountType,
  updateDiscountValue,
  validateDiscountValue,
  handleCouponSubmit,
  addNotification,
  toggleCouponForm,
}: CouponFormProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) => updateName(e.target.value)}
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
              onChange={(e) => updateCode(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={(e) => updateDiscountType(e.target.value as 'amount' | 'percentage')}
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
              onChange={(e) => updateDiscountValue(e.target.value)}
              onBlur={(e) => validateDiscountValue(e.target.value, (message) => addNotification(message, 'error'))}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={toggleCouponForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
}
