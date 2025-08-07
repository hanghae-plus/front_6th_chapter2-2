import React from "react";
import { Button } from "../ui/button/Button";
import { Input } from "../ui/input/Input";
import { Select } from "../ui/select/Select";
import { CouponFormState } from "../../types/admin";
import { validateNumericInput, validateDiscountValue } from "../../utils/validators";

interface CouponFormProps {
  couponForm: CouponFormState;
  updateField: (field: keyof CouponFormState, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

const discountTypeOptions = [
  { value: "amount", label: "정액 할인" },
  { value: "percentage", label: "정률 할인" },
];

export const CouponForm = ({ couponForm, updateField, onSubmit, onCancel, addNotification }: CouponFormProps) => {
  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validation = validateNumericInput(e.target.value);
    if (validation.isValid) {
      updateField("discountValue", validation.numericValue);
    }
  };

  const handleDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const validation = validateDiscountValue(value, couponForm.discountType);

    if (!validation.isValid) {
      addNotification(validation.errorMessage!, "error");
      updateField("discountValue", validation.correctedValue!);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="쿠폰명"
            type="text"
            value={couponForm.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="신규 가입 쿠폰"
            required
          />

          <Input
            label="쿠폰 코드"
            type="text"
            value={couponForm.code}
            onChange={(e) => updateField("code", e.target.value)}
            placeholder="WELCOME2024"
            className="font-mono"
            required
          />

          <Select
            label="할인 타입"
            value={couponForm.discountType}
            onChange={(e) => updateField("discountType", e.target.value as "amount" | "percentage")}
            options={discountTypeOptions}
          />

          <Input
            label={couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            type="text"
            value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
            onChange={handleDiscountValueChange}
            onBlur={handleDiscountValueBlur}
            placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">쿠폰 생성</Button>
        </div>
      </form>
    </div>
  );
};
