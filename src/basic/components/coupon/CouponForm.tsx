import { useState, useCallback } from "react";
import { ICoupon, ICouponForm } from "../../type";
import { MESSAGES } from "../../constants/messages";
import { validator } from "../../utils/vaildators";

interface CouponFormProps {
  // coupon
  coupons: ICoupon[];
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  addCoupon: (newCoupon: ICoupon) => void;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const CouponForm = ({
  coupons,
  setShowCouponForm,
  addCoupon,
  addNotification,
}: CouponFormProps) => {
  // 현재 작성 중인 쿠폰 정보
  const [couponForm, setCouponForm] = useState<ICouponForm>({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  // 쿠폰 추가
  const addCouponItem = useCallback(
    (newCoupon: ICoupon) => {
      // 이미 존재하는 쿠폰인지 코드로 확인
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification(MESSAGES.COUPON.ALREADY_EXISTS, "error");
        return;
      }
      addCoupon(newCoupon);
      addNotification(MESSAGES.COUPON.ADDED, "success");
    },
    [coupons, addNotification]
  );

  // 쿠폰 추가 처리 submit 함수
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCouponItem(couponForm);
    // 작성하던 쿠폰 폼 값 지움
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    // 쿠폰 작성 폼 숨기기
    setShowCouponForm(false);
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      {/* 쿠폰 생성 폼 */}
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
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  name: e.target.value,
                })
              }
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
              onChange={(e) =>
                setCouponForm({
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountType: e.target.value as "amount" | "percentage",
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
              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <input
              type="text"
              value={
                couponForm.discountValue === 0 ? "" : couponForm.discountValue
              }
              onChange={(e) => {
                const value = validator.validateNumericString(e.target.value);
                if (value === null) return;

                const discountValue = value === "" ? 0 : parseInt(value);
                setCouponForm({ ...couponForm, discountValue });
              }}
              onBlur={(e) => {
                const inputValue = validator.validateNumericString(e.target.value);
                if (inputValue === null) return;

                const value = inputValue === "" ? 0 : parseInt(inputValue);

                if (couponForm.discountType === "percentage") {
                  const { isValid, message, correctedValue } =
                    validator.isValidDiscountPercentage(value);

                  if (!isValid) addNotification(message, "error");
                  setCouponForm({
                    ...couponForm,
                    discountValue: correctedValue,
                  });
                } else {
                  const { isValid, message, correctedValue } =
                    validator.isValidDiscountAmount(value);

                  if (!isValid) addNotification(message, "error");
                  setCouponForm({
                    ...couponForm,
                    discountValue: correctedValue,
                  });
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </div>
        </div>
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

export default CouponForm;
