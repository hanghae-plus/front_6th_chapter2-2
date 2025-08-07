import type { FormEvent } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { Label } from '../ui/Label';
import { FormTitle } from './ui/FormTitle';
import { InputWithLabel } from './ui/InputWithLabel';

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: { quantity: number; rate: number }[];
}

interface Props {
  onSubmit: (e: FormEvent) => void;
  editingProduct: string | null;
  productForm: ProductForm;
  onClickCancel: () => void;
  // 훅에서 제공하는 핸들러들
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStockChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStockBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountQuantityChange: (
    index: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountRateChange: (
    index: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDiscount: (index: number) => () => void;
  handleAddDiscount: () => void;
  getDisplayValue: (value: number) => string;
  getDiscountRateDisplay: (rate: number) => number;
}

export function ProductsForm({
  onSubmit,
  editingProduct,
  productForm,
  onClickCancel,
  handleNameChange,
  handleDescriptionChange,
  handlePriceChange,
  handlePriceBlur,
  handleStockChange,
  handleStockBlur,
  handleDiscountQuantityChange,
  handleDiscountRateChange,
  handleRemoveDiscount,
  handleAddDiscount,
  getDisplayValue,
  getDiscountRateDisplay,
}: Props) {
  const { name, description, price, stock, discounts } = productForm;

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormTitle>
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </FormTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="상품명"
            value={name}
            onChange={handleNameChange}
            required
          />

          <InputWithLabel
            label="설명"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="가격"
            value={getDisplayValue(price)}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder="숫자만 입력"
            required
          />

          <InputWithLabel
            label="재고"
            value={getDisplayValue(stock)}
            onChange={handleStockChange}
            onBlur={handleStockBlur}
            placeholder="숫자만 입력"
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
                    onChange: handleDiscountQuantityChange(index),
                  },
                  {
                    key: 'discount',
                    placeholder: '%',
                    text: '할인',
                    min: '0',
                    max: '100',
                    value: getDiscountRateDisplay(discount.rate),
                    onChange: handleDiscountRateChange(index),
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
                  onClick={handleRemoveDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  {/* icon */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
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
            {editingProduct === 'new' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
