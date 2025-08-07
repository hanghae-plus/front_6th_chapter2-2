import React from "react";
import { processCouponForm, resetCouponForm } from "../../models/coupon";
import { useValidate } from "../../utils/hooks/useValidate";
import { useCoupons } from "../../hooks/useCoupons";
import { useNotifications } from "../../hooks/useNotifications";

export const CouponForm = () => {
  const { validateDiscountValue, filterNumericInput } = useValidate();
  const { onError } = useNotifications();
  const {
    coupons,
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
  } = useCoupons();

  const handleCouponSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = processCouponForm(coupons, couponForm);

    if (!result.success) {
      onError(result.message);
      return;
    }

    addCoupon(result.coupon!);

    setCouponForm(resetCouponForm());
    setShowCouponForm(false);
  };

  const handleCouponCancel = () => {
    setCouponForm(resetCouponForm());
    setShowCouponForm(false);
  };

  const handleDiscountValueBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const discountValidation = validateDiscountValue(
      event.target.value,
      couponForm.discountType
    );

    if (!discountValidation.isValid && discountValidation.error) {
      onError(discountValidation.error);
    }
    setCouponForm({
      ...couponForm,
      discountValue: discountValidation.discountValue,
    });
  };

  const filterDiscountValueOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputFilter = filterNumericInput(event.target.value);

    if (inputFilter.shouldUpdate) {
      setCouponForm({
        ...couponForm,
        discountValue: inputFilter.filteredValue,
      });
    }
  };

  const updateCouponNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCouponForm({
      ...couponForm,
      name: event.target.value,
    });
  };

  const updateCouponCodeOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCouponForm({
      ...couponForm,
      code: event.target.value.toUpperCase(),
    });
  };

  const updateDiscountTypeOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCouponForm({
      ...couponForm,
      discountType: event.target.value as "amount" | "percentage",
    });
  };

  if (!showCouponForm) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponForm.name}
              onChange={updateCouponNameOnChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <input
              type="text"
              value={couponForm.code}
              onChange={updateCouponCodeOnChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={updateDiscountTypeOnChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <input
              type="text"
              value={
                couponForm.discountValue === 0 ? "" : couponForm.discountValue
              }
              onChange={filterDiscountValueOnChange}
              onBlur={handleDiscountValueBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCouponCancel}
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
