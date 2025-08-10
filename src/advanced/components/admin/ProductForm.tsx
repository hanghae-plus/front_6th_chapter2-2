import React from "react";
import Button from "../ui/Button";
import { VALIDATION_LIMITS } from "../../utils/constants";
import { isValidNumericInput } from "../../utils/validators";
import { numberUtils } from "../../utils/numberUtils";
import { useNotification } from "../../hooks/useNotification";
import { useProductForm } from "../../hooks/useProductForm";

type Props = {
  mode: "new" | "edit";
  onSubmit: (values: ReturnType<typeof useProductForm>["productForm"]) => void;
  onCancel: () => void;
  initialValues?: Partial<ReturnType<typeof useProductForm>["productForm"]>;
};

export default function ProductForm({
  mode,
  onSubmit,
  onCancel,
  initialValues,
}: Props) {
  const { addNotification } = useNotification();
  const {
    productForm,
    setProductForm,
    resetProductForm,
    addDiscount,
    updateDiscountAt,
    removeDiscountAt,
  } = useProductForm(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(productForm);
    resetProductForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        {mode === "new" ? "새 상품 추가" : "상품 수정"}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상품명
          </label>
          <input
            type="text"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <input
            type="text"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가격
          </label>
          <input
            type="text"
            value={productForm.price === 0 ? "" : productForm.price}
            onChange={(e) => {
              const value = e.target.value;
              if (isValidNumericInput(value)) {
                setProductForm({
                  ...productForm,
                  price: value === "" ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "") {
                setProductForm({ ...productForm, price: 0 });
              } else if (!numberUtils.isNonNegative(parseInt(value))) {
                addNotification(
                  `가격은 ${VALIDATION_LIMITS.PRODUCT.MIN_VALUE}보다 커야 합니다`,
                  "error"
                );
                setProductForm({
                  ...productForm,
                  price: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
                });
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            placeholder="숫자만 입력"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            재고
          </label>
          <input
            type="text"
            value={productForm.stock === 0 ? "" : productForm.stock}
            onChange={(e) => {
              const value = e.target.value;
              if (isValidNumericInput(value)) {
                setProductForm({
                  ...productForm,
                  stock: value === "" ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "") {
                setProductForm({ ...productForm, stock: 0 });
              } else {
                const stockValue = parseInt(value);
                const clampedStock = numberUtils.clamp(
                  stockValue,
                  VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
                  VALIDATION_LIMITS.PRODUCT.MAX_STOCK
                );

                if (stockValue !== clampedStock) {
                  addNotification(
                    `재고는 ${VALIDATION_LIMITS.PRODUCT.MIN_STOCK}개 이상 ${VALIDATION_LIMITS.PRODUCT.MAX_STOCK}개 이하여야 합니다`,
                    "error"
                  );
                  setProductForm({ ...productForm, stock: clampedStock });
                }
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            placeholder="숫자만 입력"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          할인 정책
        </label>
        <div className="space-y-2">
          {productForm.discounts.map((discount, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
            >
              <input
                type="number"
                value={discount.quantity}
                onChange={(e) =>
                  updateDiscountAt(index, {
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 px-2 py-1 border rounded"
                min="1"
                placeholder="수량"
              />
              <span className="text-sm">개 이상 구매 시</span>
              <input
                type="number"
                value={discount.rate * 100}
                onChange={(e) =>
                  updateDiscountAt(index, {
                    rate: (parseInt(e.target.value) || 0) / 100,
                  })
                }
                className="w-16 px-2 py-1 border rounded"
                min="0"
                max="100"
                placeholder="%"
              />
              <span className="text-sm">% 할인</span>
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => removeDiscountAt(index)}
              >
                삭제
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="indigo"
            size="small"
            onClick={addDiscount}
            className="!px-2 !py-1"
          >
            + 할인 추가
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="indigo">
          {mode === "new" ? "추가" : "수정"}
        </Button>
      </div>
    </form>
  );
}
