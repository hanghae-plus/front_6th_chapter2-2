import React from 'react';
import Form from '../ui/Form.tsx';
import Select from '../ui/Select.tsx';
import Input from '../ui/Input.tsx';
import Button from '../ui/Button.tsx';
import { Coupon } from '../../models/entities';

interface CouponFormProps {
  handler: {
    handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCouponSubmit: (e: React.FormEvent) => void;
    handleDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  state: {
    couponForm: Coupon;
  };
  actions: {
    closeForm: () => void;
  };
}

const CouponForm = ({ handler, state, actions }: CouponFormProps) => {
  return (
    <Form onSubmit={handler.handleCouponSubmit} title={'  새 쿠폰 생성'}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            쿠폰명
          </label>
          <Input
            name={'name'}
            type="text"
            value={state.couponForm.name}
            onChange={handler.handleFieldChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            placeholder="신규 가입 쿠폰"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            쿠폰 코드
          </label>
          <Input
            name={'code'}
            type="text"
            value={state.couponForm.code}
            onChange={handler.handleFieldChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
            placeholder="WELCOME2024"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            할인 타입
          </label>
          <Select
            value={state.couponForm.discountType}
            items={[
              { label: '정액 할인', value: 'amount' },
              { label: '정률 할인', value: 'percentage' },
            ]}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            getLabel={item => item.label}
            getValue={item => item.value}
            onChange={handler.handleDiscountTypeChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {state.couponForm.discountType === 'amount'
              ? '할인 금액'
              : '할인율(%)'}
          </label>
          <Input
            name={'discountValue'}
            value={
              state.couponForm.discountValue === 0
                ? ''
                : state.couponForm.discountValue
            }
            onChange={handler.handleFieldChange}
            onBlur={handler.handleBlur}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            placeholder={
              state.couponForm.discountType === 'amount' ? '5000' : '10'
            }
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={actions.closeForm}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          쿠폰 생성
        </Button>
      </div>
    </Form>
  );
};

export default CouponForm;
