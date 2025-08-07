// 상품 추가/수정 폼 컴포넌트 (기존 AdminPage 구조 유지)
import React from "react";
import { CloseIcon } from "../icons";
import { ProductFormData } from "../../type/types";

interface ProductFormProps {
  isVisible: boolean;
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingProduct: string | null;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ProductForm({
  isVisible,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  editingProduct,
  addNotification,
}: ProductFormProps) {
  if (!isVisible) return null;

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  name: e.target.value,
                })
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
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  description: e.target.value,
                })
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
              value={formData.price === 0 ? "" : formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  onFormDataChange({
                    ...formData,
                    price: value === "" ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onFormDataChange({ ...formData, price: 0 });
                } else if (parseInt(value) < 0) {
                  addNotification("가격은 0보다 커야 합니다", "error");
                  onFormDataChange({ ...formData, price: 0 });
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
              value={formData.stock === 0 ? "" : formData.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  onFormDataChange({
                    ...formData,
                    stock: value === "" ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onFormDataChange({ ...formData, stock: 0 });
                } else if (parseInt(value) < 0) {
                  addNotification("재고는 0보다 커야 합니다", "error");
                  onFormDataChange({ ...formData, stock: 0 });
                } else if (parseInt(value) > 9999) {
                  addNotification(
                    "재고는 9999개를 초과할 수 없습니다",
                    "error"
                  );
                  onFormDataChange({ ...formData, stock: 9999 });
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
            {formData.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...formData.discounts];
                    newDiscounts[index].quantity =
                      parseInt(e.target.value) || 0;
                    onFormDataChange({
                      ...formData,
                      discounts: newDiscounts,
                    });
                  }}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => {
                    const newDiscounts = [...formData.discounts];
                    newDiscounts[index].rate =
                      (parseInt(e.target.value) || 0) / 100;
                    onFormDataChange({
                      ...formData,
                      discounts: newDiscounts,
                    });
                  }}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => {
                    const newDiscounts = formData.discounts.filter(
                      (_, i) => i !== index
                    );
                    onFormDataChange({
                      ...formData,
                      discounts: newDiscounts,
                    });
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                onFormDataChange({
                  ...formData,
                  discounts: [
                    ...formData.discounts,
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
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === "new" ? "추가" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
