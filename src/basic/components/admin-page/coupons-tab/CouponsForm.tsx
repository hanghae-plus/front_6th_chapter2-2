import type { Dispatch, FormEvent, SetStateAction } from 'react';
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
  setCouponForm: Dispatch<SetStateAction<CouponForm>>;
  onSubmit: (e: FormEvent) => void;
  addNotification: (params: {
    message: string;
    type?: 'error' | 'success' | 'warning';
  }) => void;
  setShowCouponForm: Dispatch<SetStateAction<boolean>>;
}

export function CouponsForm({
  couponForm,
  setCouponForm,
  onSubmit,
  addNotification,
  setShowCouponForm,
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
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                name: e.target.value,
              })
            }
            placeholder="신규 가입 쿠폰"
          />

          <InputWithLabel
            label="쿠폰 코드"
            value={code}
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder="WELCOME2024"
            required
          />

          <SelectWithLabel
            label="할인 타입"
            options={[
              { label: '정액 할인', value: 'amount' },
              { label: '정률 할인', value: 'percentage' },
            ]}
            value={discountType}
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                discountType: e.target.value as 'amount' | 'percentage',
              })
            }
          />

          <InputWithLabel
            label={discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            value={discountValue === 0 ? '' : discountValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                setCouponForm({
                  ...couponForm,
                  discountValue: value === '' ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = parseInt(e.target.value) || 0;
              if (discountType === 'percentage') {
                if (value > 100) {
                  addNotification({
                    message: '할인율은 100%를 초과할 수 없습니다',
                    type: 'error',
                  });
                  setCouponForm({
                    ...couponForm,
                    discountValue: 100,
                  });
                } else if (value < 0) {
                  setCouponForm({
                    ...couponForm,
                    discountValue: 0,
                  });
                }
              } else {
                if (value > 100000) {
                  addNotification({
                    message: '할인 금액은 100,000원을 초과할 수 없습니다',
                    type: 'error',
                  });
                  setCouponForm({
                    ...couponForm,
                    discountValue: 100000,
                  });
                } else if (value < 0) {
                  setCouponForm({
                    ...couponForm,
                    discountValue: 0,
                  });
                }
              }
            }}
            placeholder={discountType === 'amount' ? '5000' : '10'}
            required
          />
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
}
