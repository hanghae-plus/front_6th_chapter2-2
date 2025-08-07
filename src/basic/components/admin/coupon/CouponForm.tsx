import { Dispatch, SetStateAction, useMemo } from "react";
import { Coupon } from "../../../../types";
import { useCouponFormHandlers } from "../../../hooks/useCouponFormHandlers";
import { couponHandlers, DISCOUNT_TYPE_OPTIONS, MAX_COUPON_CODE_LENGTH, MAX_COUPON_NAME_LENGTH } from "../../../utils/couponUtils";

interface ICouponFormProps {
  addCoupon: (coupon: Coupon) => void;
  clearCouponForm: () => void;
  setShowCouponForm: Dispatch<SetStateAction<boolean>>;
  couponForm: Coupon;
  setCouponForm: Dispatch<SetStateAction<Coupon>>;
}

const CouponForm = ({ addCoupon, clearCouponForm, setShowCouponForm, couponForm, setCouponForm }: ICouponFormProps) => {
  /** 할인 타입에 따른 레이블과 플레이스홀더 설정 */
  const discountConfig = useMemo(() => couponHandlers.getDiscountConfig(couponForm.discountType), [couponForm.discountType]);

  /** 쿠폰 폼 핸들러 사용 */
  const { handleNameChange, handleCodeChange, handleDiscountTypeChange, handleDiscountValueChange, handleDiscountValueBlur, handleCancel, handleCouponSubmit } = useCouponFormHandlers({
    setCouponForm,
    couponForm,
    setShowCouponForm,
    clearCouponForm,
    addCoupon,
  });

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 쿠폰명 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={couponForm.name}
              onChange={handleNameChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
              maxLength={MAX_COUPON_NAME_LENGTH}
            />
          </div>

          {/* 쿠폰 코드 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={couponForm.code}
              onChange={handleCodeChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
              maxLength={MAX_COUPON_CODE_LENGTH}
            />
          </div>

          {/* 할인 타입 선택 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={handleDiscountTypeChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              {DISCOUNT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 할인값 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {discountConfig.label} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
              onChange={handleDiscountValueChange}
              onBlur={handleDiscountValueBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={discountConfig.placeholder}
              required
            />
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            취소
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
