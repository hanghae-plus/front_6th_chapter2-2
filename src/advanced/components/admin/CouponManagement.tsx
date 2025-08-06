import { useState } from "react";
import { CouponForm } from "../../types";
import { Coupon } from "../../../types";
import { useCouponContext } from "../../contexts/CouponContext";
import { useNotificationContext } from "../../contexts/NotificationContext";

export const CouponManagement = () => {
  const { coupons, addCoupon, deleteCoupon } = useCouponContext();
  const { addNotification } = useNotificationContext();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });
  const [validationError, setValidationError] = useState<string>("");

  const onCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 할인율 검증
    if (
      couponForm.discountType === "percentage" &&
      couponForm.discountValue > 100
    ) {
      setValidationError("할인율은 100%를 초과할 수 없습니다");
      return;
    }

    setValidationError("");

    const newCoupon: Coupon = {
      name: couponForm.name,
      code: couponForm.code,
      discountType: couponForm.discountType,
      discountValue: couponForm.discountValue,
    };

    addCoupon(newCoupon);
    addNotification("쿠폰이 생성되었습니다.", "success");

    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const onDiscountValueChange = (value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);

    if (couponForm.discountType === "percentage" && numValue > 100) {
      setValidationError("할인율은 100%를 초과할 수 없습니다");
    } else {
      setValidationError("");
    }

    setCouponForm({
      ...couponForm,
      discountValue: numValue,
    });
  };

  const onToggleCouponForm = () => {
    setShowCouponForm(!showCouponForm);
  };

  const onCouponNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({ ...couponForm, name: e.target.value });
  };

  const onCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({
      ...couponForm,
      code: e.target.value.toUpperCase(),
    });
  };

  const onDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCouponForm({
      ...couponForm,
      discountType: e.target.value as "amount" | "percentage",
    });
  };

  const onDiscountValueInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      onDiscountValueChange(value);
    }
  };

  const onDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (couponForm.discountType === "percentage" && parseInt(value) > 100) {
      setValidationError("할인율은 100%를 초과할 수 없습니다");
    }
  };

  const onCancelClick = () => {
    setShowCouponForm(false);
    setValidationError("");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {coupon.discountType === "amount"
                      ? `${coupon.discountValue}원 할인`
                      : `${coupon.discountValue}% 할인`}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{coupon.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {coupon.discountType === "amount"
                      ? `${coupon.discountValue.toLocaleString()}원 할인`
                      : `${coupon.discountValue}% 할인`}
                  </p>
                  <p className="text-sm font-mono text-gray-500 mt-1">
                    {coupon.code}
                  </p>
                </div>
                <button
                  onClick={() => deleteCoupon(coupon.code)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={onToggleCouponForm}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={onCouponSubmit} className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">
                새 쿠폰 생성
              </h3>
              {validationError && (
                <div className="text-red-600 text-sm">{validationError}</div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    쿠폰명
                  </label>
                  <input
                    type="text"
                    value={couponForm.name}
                    onChange={onCouponNameChange}
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
                    onChange={onCouponCodeChange}
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
                    onChange={onDiscountTypeChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                  >
                    <option value="amount">정액 할인</option>
                    <option value="percentage">정률 할인</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {couponForm.discountType === "amount"
                      ? "할인 금액"
                      : "할인율(%)"}
                  </label>
                  <input
                    type="text"
                    value={
                      couponForm.discountValue === 0
                        ? ""
                        : couponForm.discountValue
                    }
                    onChange={onDiscountValueInputChange}
                    onBlur={onDiscountValueBlur}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                    placeholder={
                      couponForm.discountType === "amount" ? "5000" : "10"
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancelClick}
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
        )}
      </div>
    </section>
  );
};
