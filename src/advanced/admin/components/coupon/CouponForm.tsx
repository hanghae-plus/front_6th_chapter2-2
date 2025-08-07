import { initialCouponForm } from '../../../shared/constants';
import {
  Coupon,
  DISCOUNT_TYPE_AMOUNT,
  DISCOUNT_TYPE_PERCENTAGE,
  DiscountType,
} from '../../../shared/types';
import { useCoupon } from '../../../shared/hooks/useCoupon';
import { useNotification } from '../../../shared/hooks/useNotification';

export const CouponForm = ({
  setShowCouponForm,
  couponForm,
  setCouponForm,
}: {
  setShowCouponForm: (show: boolean) => void;
  couponForm: Coupon;
  setCouponForm: (coupon: Coupon) => void;
}) => {
  const { addCoupon } = useCoupon();
  const { addNotification } = useNotification();

  // 쿠폰 제출
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm(initialCouponForm);
    setShowCouponForm(false);
  };

  // 쿠폰 변경
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCouponForm({ ...couponForm, [name]: value });
  };

  // 쿠폰 코드 변경
  const changeCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() });
  };

  // 할인 금액 변경
  const changeDiscountValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  // 할인 타입 변경
  const changeDiscountType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCouponForm({
      ...couponForm,
      discountType: e.target.value as DiscountType,
    });
  };

  // 할인 금액 포커스 아웃
  const handleDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (couponForm.discountType === DISCOUNT_TYPE_PERCENTAGE) {
      if (value > 100) {
        addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
        setCouponForm({ ...couponForm, discountValue: 100 });
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 });
      }
    } else {
      if (value > 100000) {
        addNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
        setCouponForm({ ...couponForm, discountValue: 100000 });
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 });
      }
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 쿠폰명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              name="name"
              type="text"
              value={couponForm.name}
              onChange={handleCouponChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>

          {/* 쿠폰 코드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <input
              name="code"
              type="text"
              value={couponForm.code}
              onChange={changeCouponCode}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>

          {/* 할인 타입 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              name="discountType"
              value={couponForm.discountType}
              onChange={changeDiscountType}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value={DISCOUNT_TYPE_AMOUNT}>정액 할인</option>
              <option value={DISCOUNT_TYPE_PERCENTAGE}>정률 할인</option>
            </select>
          </div>

          {/* 할인 금액 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === DISCOUNT_TYPE_AMOUNT
                ? '할인 금액'
                : '할인율(%)'}
            </label>
            <input
              name="discountValue"
              type="text"
              value={
                couponForm.discountValue === 0 ? '' : couponForm.discountValue
              }
              onChange={changeDiscountValue}
              onBlur={handleDiscountValueBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={
                couponForm.discountType === DISCOUNT_TYPE_AMOUNT ? '5000' : '10'
              }
              required
            />
          </div>
        </div>

        {/* 쿠폰 생성 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowCouponForm(false)}
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
};
