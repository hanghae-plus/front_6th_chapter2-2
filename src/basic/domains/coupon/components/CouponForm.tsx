import type { ChangeEvent, FocusEvent, FormEvent } from "react";

import { Button, SearchInput } from "../../../shared";

type CouponFormType = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type CouponFormProps = {
  couponForm: CouponFormType;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  onFormChange: (form: CouponFormType) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export function CouponForm({
  couponForm,
  onSubmit,
  onCancel,
  onFormChange,
  addNotification
}: CouponFormProps) {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFormChange({
      ...couponForm,
      name: e.target.value
    });
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFormChange({
      ...couponForm,
      code: e.target.value.toUpperCase()
    });
  };

  const handleDiscountTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFormChange({
      ...couponForm,
      discountType: e.target.value as "amount" | "percentage"
    });
  };

  const handleDiscountValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      onFormChange({
        ...couponForm,
        discountValue: value === "" ? 0 : parseInt(value)
      });
    }
  };

  const handleDiscountValueBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value) || 0;

    if (couponForm.discountType === "percentage") {
      if (numValue > 100) {
        addNotification("할인율은 100%를 초과할 수 없습니다", "error");
        onFormChange({ ...couponForm, discountValue: 100 });
      } else if (numValue < 0) {
        onFormChange({ ...couponForm, discountValue: 0 });
      }
    } else {
      if (numValue > 100000) {
        addNotification("할인 금액은 100,000원을 초과할 수 없습니다", "error");
        onFormChange({ ...couponForm, discountValue: 100000 });
      } else if (numValue < 0) {
        onFormChange({ ...couponForm, discountValue: 0 });
      }
    }
  };

  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <SearchInput
              type="text"
              label="쿠폰명"
              value={couponForm.name}
              onChange={handleNameChange}
              className="text-sm shadow-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <SearchInput
              type="text"
              label="쿠폰 코드"
              value={couponForm.code}
              onChange={handleCodeChange}
              className="font-mono text-sm shadow-sm"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={handleDiscountTypeChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <SearchInput
              type="text"
              label={couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
              value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
              onChange={handleDiscountValueChange}
              onBlur={handleDiscountValueBlur}
              className="text-sm shadow-sm"
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" color="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" color="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
