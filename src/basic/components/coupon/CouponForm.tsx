import { useState } from "react";
import { Coupon } from "../../../types";
import {
  COUPON_FORM_INITIAL_STATE,
  COUPON_LIMITS,
} from "../../constants/coupon";

interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  onSubmit,
  onCancel,
  addNotification,
}) => {
  const [formData, setFormData] = useState(COUPON_FORM_INITIAL_STATE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Coupon);
    setFormData(COUPON_FORM_INITIAL_STATE);
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getDiscountValuePlaceholder = () => {
    return formData.discountType === "amount" ? "5000" : "10";
  };

  const getDiscountValueMax = () => {
    return COUPON_LIMITS[formData.discountType].max;
  };

  const getDiscountValueMin = () => {
    return COUPON_LIMITS[formData.discountType].min;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            쿠폰명
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
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
            value={formData.code}
            onChange={(e) =>
              handleInputChange("code", e.target.value.toUpperCase())
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
            value={formData.discountType}
            onChange={(e) =>
              handleInputChange(
                "discountType",
                e.target.value as "amount" | "percentage"
              )
            }
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
          >
            <option value="amount">정액 할인</option>
            <option value="percentage">정률 할인</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {formData.discountType === "amount" ? "할인 금액" : "할인율(%)"}
          </label>
          <input
            type="number"
            value={formData.discountValue === 0 ? "" : formData.discountValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                handleInputChange(
                  "discountValue",
                  value === "" ? 0 : parseInt(value)
                );
              }
            }}
            onBlur={(e) => {
              const value = parseInt(e.target.value) || 0;
              const max = getDiscountValueMax();
              const min = getDiscountValueMin();

              if (value > max) {
                if (formData.discountType === "percentage") {
                  addNotification(
                    `할인율은 ${max}%를 초과할 수 없습니다`,
                    "error"
                  );
                } else {
                  addNotification(
                    `할인 금액은 ${max}원을 초과할 수 없습니다`,
                    "error"
                  );
                }

                handleInputChange("discountValue", max);
              } else if (value < min) {
                handleInputChange("discountValue", min);
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            placeholder={getDiscountValuePlaceholder()}
            min={getDiscountValueMin()}
            max={getDiscountValueMax()}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
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
  );
};
