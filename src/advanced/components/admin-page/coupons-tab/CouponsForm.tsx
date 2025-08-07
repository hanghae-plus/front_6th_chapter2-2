import type { FormEvent } from 'react';
import { InputWithLabel } from '../ui/InputWithLabel';
import { FormTitle } from './ui/FormTitle';
import { SelectWithLabel } from './ui/SelectWithLabel';

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

interface Props {
  couponForm: CouponForm;
  onSubmit: (e: FormEvent) => void;
  onClickCancel: () => void;
  // 훅에서 제공하는 핸들러들
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDiscountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountValueBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getDisplayValue: ({ value }: { value: number }) => string;
  getDiscountLabel: ({
    discountType,
  }: {
    discountType: 'amount' | 'percentage';
  }) => string;
  getDiscountPlaceholder: ({
    discountType,
  }: {
    discountType: 'amount' | 'percentage';
  }) => string;
}

export function CouponsForm({
  couponForm,
  onSubmit,
  onClickCancel,
  handleNameChange,
  handleCodeChange,
  handleDiscountTypeChange,
  handleDiscountValueChange,
  handleDiscountValueBlur,
  getDisplayValue,
  getDiscountLabel,
  getDiscountPlaceholder,
}: Props) {
  const { name, code, discountType, discountValue } = couponForm;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormTitle>새 쿠폰 생성</FormTitle>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InputWithLabel
            label="쿠폰명"
            value={name}
            onChange={handleNameChange}
            placeholder="신규 가입 쿠폰"
            variant="coupons"
          />

          <InputWithLabel
            label="쿠폰 코드"
            value={code}
            onChange={handleCodeChange}
            placeholder="WELCOME2024"
            variant="coupons"
            required
          />

          <SelectWithLabel
            label="할인 타입"
            options={[
              { label: '정액 할인', value: 'amount' },
              { label: '정률 할인', value: 'percentage' },
            ]}
            value={discountType}
            onChange={handleDiscountTypeChange}
          />

          <InputWithLabel
            label={getDiscountLabel({ discountType })}
            value={getDisplayValue({ value: discountValue })}
            onChange={handleDiscountValueChange}
            onBlur={handleDiscountValueBlur}
            placeholder={getDiscountPlaceholder({ discountType })}
            variant="coupons"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClickCancel}
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
