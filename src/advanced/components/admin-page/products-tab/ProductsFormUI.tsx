import type { ChangeEvent, FormEvent } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { CloseIcon } from '../../icons';
import { Label } from '../ui/Label';
import { FormTitle } from './ui/FormTitle';
import { InputWithLabel } from './ui/InputWithLabel';

interface DiscountItem {
  quantity: string;
  rate: string;
  onQuantityChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

interface ProductsFormUIProps {
  title: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  discounts: DiscountItem[];
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPriceBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  onStockChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStockBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddDiscount: () => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export function ProductsFormUI({
  title,
  name,
  description,
  price,
  stock,
  discounts,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onPriceBlur,
  onStockChange,
  onStockBlur,
  onAddDiscount,
  onSubmit,
  onCancel,
}: ProductsFormUIProps) {
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormTitle>{title}</FormTitle>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="상품명"
            value={name}
            onChange={onNameChange}
            variant="products"
            required
          />

          <InputWithLabel
            label="설명"
            value={description}
            onChange={onDescriptionChange}
            variant="products"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="가격"
            value={price}
            onChange={onPriceChange}
            onBlur={onPriceBlur}
            placeholder="숫자만 입력"
            variant="products"
            required
          />

          <InputWithLabel
            label="재고"
            value={stock}
            onChange={onStockChange}
            onBlur={onStockBlur}
            placeholder="숫자만 입력"
            variant="products"
            required
          />
        </div>

        <div className="mt-4">
          <Label>할인 정책</Label>

          <div className="space-y-2">
            {discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                {[
                  {
                    key: 'quantity',
                    placeholder: '수량',
                    text: '개 이상 구매 시',
                    min: '1',
                    value: discount.quantity,
                    onChange: discount.onQuantityChange,
                  },
                  {
                    key: 'discount',
                    placeholder: '%',
                    text: '할인',
                    min: '0',
                    max: '100',
                    value: discount.rate,
                    onChange: discount.onRateChange,
                  },
                ].map(({ key, text, ...inputOptions }) => {
                  return (
                    <Fragment key={key}>
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border rounded"
                        {...inputOptions}
                      />
                      <span className="text-sm">{text}</span>
                    </Fragment>
                  );
                })}

                <button
                  type="button"
                  onClick={discount.onRemove}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={onAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
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
            {title.includes('추가') ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
