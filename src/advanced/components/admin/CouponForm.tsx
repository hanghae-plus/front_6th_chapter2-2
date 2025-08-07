// 쿠폰 추가 폼 컴포넌트 (기존 AdminPage 구조 유지)
import React from "react";
import { CouponFormData } from "../../type/types";
import {
  MAX_PERCENTAGE_DISCOUNT,
  MAX_AMOUNT_DISCOUNT,
} from "../../constants/coupon";

interface CouponFormProps {
  isVisible: boolean;
  formData: CouponFormData;
  onFormDataChange: (data: CouponFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function CouponForm({
  isVisible,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  addNotification,
}: CouponFormProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
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
              value={formData.code}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
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
              value={formData.discountType}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
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
              {formData.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <input
              type="text"
              value={formData.discountValue === 0 ? "" : formData.discountValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  onFormDataChange({
                    ...formData,
                    discountValue: value === "" ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (formData.discountType === "percentage") {
                  if (value > MAX_PERCENTAGE_DISCOUNT) {
                    addNotification(
                      "할인율은 100%를 초과할 수 없습니다",
                      "error"
                    );
                    onFormDataChange({
                      ...formData,
                      discountValue: MAX_PERCENTAGE_DISCOUNT,
                    });
                  } else if (value < 0) {
                    onFormDataChange({
                      ...formData,
                      discountValue: 0,
                    });
                  }
                } else {
                  if (value > MAX_AMOUNT_DISCOUNT) {
                    addNotification(
                      "할인 금액은 100,000원을 초과할 수 없습니다",
                      "error"
                    );
                    onFormDataChange({
                      ...formData,
                      discountValue: MAX_AMOUNT_DISCOUNT,
                    });
                  } else if (value < 0) {
                    onFormDataChange({
                      ...formData,
                      discountValue: 0,
                    });
                  }
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={formData.discountType === "amount" ? "5000" : "10"}
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
    </div>
  );
}
