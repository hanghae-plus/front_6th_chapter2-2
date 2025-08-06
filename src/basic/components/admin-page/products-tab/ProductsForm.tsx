import type { ChangeEvent, FormEvent } from 'react';
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
  setProductForm: (productForm: ProductForm) => void;
  addNotification: (params: {
    message: string;
    type: 'error' | 'success';
  }) => void;
  clearProductsForm: () => void;
}

export function ProductsForm({
  onSubmit,
  editingProduct,
  productForm,
  setProductForm,
  addNotification,
  clearProductsForm,
}: Props) {
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormTitle>
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </FormTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="상품명"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
            required
          />

          <InputWithLabel
            label="설명"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="가격"
            value={productForm.price === 0 ? '' : productForm.price.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                setProductForm({
                  ...productForm,
                  price: value === '' ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === '') {
                setProductForm({ ...productForm, price: 0 });
              } else if (parseInt(value) < 0) {
                addNotification({
                  message: '가격은 0보다 커야 합니다',
                  type: 'error',
                });
                setProductForm({ ...productForm, price: 0 });
              }
            }}
            placeholder="숫자만 입력"
            required
          />

          <InputWithLabel
            label="재고"
            value={productForm.stock === 0 ? '' : productForm.stock.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                setProductForm({
                  ...productForm,
                  stock: value === '' ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === '') {
                setProductForm({ ...productForm, stock: 0 });
              } else if (parseInt(value) < 0) {
                addNotification({
                  message: '재고는 0보다 커야 합니다',
                  type: 'error',
                });
                setProductForm({ ...productForm, stock: 0 });
              } else if (parseInt(value) > 9999) {
                addNotification({
                  message: '재고는 9999개를 초과할 수 없습니다',
                  type: 'error',
                });
                setProductForm({ ...productForm, stock: 9999 });
              }
            }}
            placeholder="숫자만 입력"
            required
          />
        </div>

        <div className="mt-4">
          <Label>할인 정책</Label>

          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
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
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      const newDiscounts = [...productForm.discounts];
                      newDiscounts[index].quantity =
                        parseInt(e.target.value) || 0;
                      setProductForm({
                        ...productForm,
                        discounts: newDiscounts,
                      });
                    },
                  },
                  {
                    key: 'discount',
                    placeholder: '%',
                    text: '할인',
                    min: '0',
                    max: '100',
                    value: discount.rate * 100,
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      const newDiscounts = [...productForm.discounts];
                      newDiscounts[index].rate =
                        (parseInt(e.target.value) || 0) / 100;
                      setProductForm({
                        ...productForm,
                        discounts: newDiscounts,
                      });
                    },
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
                  onClick={() => {
                    const newDiscounts = productForm.discounts.filter(
                      (_, i) => i !== index
                    );
                    setProductForm({
                      ...productForm,
                      discounts: newDiscounts,
                    });
                  }}
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
              onClick={() => {
                setProductForm({
                  ...productForm,
                  discounts: [
                    ...productForm.discounts,
                    { quantity: 10, rate: 0.1 },
                  ],
                });
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={clearProductsForm}
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
