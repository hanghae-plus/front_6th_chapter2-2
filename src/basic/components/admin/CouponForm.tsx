import React from "react";
import Button from "../ui/Button";
import { VALIDATION_LIMITS } from "../../utils/constants";
import { isValidNumericInput } from "../../utils/validators";
import { numberUtils } from "../../utils/numberUtils";
import { useCouponForm } from "../../hooks/useCouponForm";

type Props = {
  onSubmit: (values: ReturnType<typeof useCouponForm>["couponForm"]) => void;
  onCancel: () => void;
  notification?: {
    add: (message: string, type?: "error" | "success" | "warning") => void;
  };
};

export default function CouponForm({
  onSubmit,
  onCancel,
  notification,
}: Props) {
  const { couponForm, setCouponForm, resetCouponForm } = useCouponForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(couponForm);
    resetCouponForm();
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
            value={couponForm.name}
            onChange={(e) =>
              setCouponForm({ ...couponForm, name: e.target.value })
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
              const value = e.target.value;
              if (isValidNumericInput(value)) {
                setCouponForm({
                  ...couponForm,
                  discountValue: value === "" ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = parseInt(e.target.value) || 0;
              const limits = VALIDATION_LIMITS.DISCOUNT;

              if (couponForm.discountType === "percentage") {
                const clampedValue = numberUtils.clamp(
                  value,
                  limits.MIN_VALUE,
                  limits.MAX_PERCENTAGE
                );
                if (value !== clampedValue) {
                  setCouponForm({ ...couponForm, discountValue: clampedValue });
                  if (value > limits.MAX_PERCENTAGE) {
                    notification?.add(
                      "할인율은 100%를 초과할 수 없습니다",
                      "error"
                    );
                  }
                }
              } else {
                const clampedValue = numberUtils.clamp(
                  value,
                  limits.MIN_VALUE,
                  limits.MAX_AMOUNT
                );
                if (value !== clampedValue) {
                  setCouponForm({ ...couponForm, discountValue: clampedValue });
                }
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="indigo">
          쿠폰 생성
        </Button>
      </div>
    </form>
  );
}
