import { Product } from "../types";
import CloseIcon from "../../../assets/icons/CloseIcon.svg?react";
import { NotificationVariant } from "../../notification/types";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface ProductFormFieldsProps {
  product: Partial<ProductWithUI>;
  onChange: (field: keyof ProductWithUI, value: any) => void;
  errors?: Record<string, string>;
  addNotification: (message: string, variant?: NotificationVariant) => void;
}

export function ProductFormFields({
  product,
  onChange,
  errors = {},
  addNotification,
}: ProductFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상품명
          </label>
          <input
            type="text"
            value={product.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <input
            type="text"
            value={product.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가격
          </label>
          <input
            type="text"
            value={product.price === 0 ? "" : product.price || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                onChange("price", value === "" ? 0 : parseInt(value));
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "") {
                onChange("price", 0);
              } else if (parseInt(value) < 0) {
                addNotification(
                  "가격은 0보다 커야 합니다",
                  NotificationVariant.ERROR
                );
                onChange("price", 0);
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            placeholder="숫자만 입력"
            required
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            재고
          </label>
          <input
            type="text"
            value={product.stock === 0 ? "" : product.stock || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                onChange("stock", value === "" ? 0 : parseInt(value));
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "") {
                onChange("stock", 0);
              } else if (parseInt(value) < 0) {
                addNotification(
                  "재고는 0보다 커야 합니다",
                  NotificationVariant.ERROR
                );
                onChange("stock", 0);
              } else if (parseInt(value) > 9999) {
                addNotification(
                  "재고는 9999개를 초과할 수 없습니다",
                  NotificationVariant.ERROR
                );
                onChange("stock", 9999);
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            placeholder="숫자만 입력"
            required
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          할인 정책
        </label>
        <div className="space-y-2">
          {(product.discounts || []).map((discount, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
            >
              <input
                type="number"
                value={discount.quantity}
                onChange={(e) => {
                  const newDiscounts = [...(product.discounts || [])];
                  newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                  onChange("discounts", newDiscounts);
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
                  const newDiscounts = [...(product.discounts || [])];
                  newDiscounts[index].rate =
                    (parseInt(e.target.value) || 0) / 100;
                  onChange("discounts", newDiscounts);
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
                  const newDiscounts = (product.discounts || []).filter(
                    (_, i) => i !== index
                  );
                  onChange("discounts", newDiscounts);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newDiscounts = [
                ...(product.discounts || []),
                { quantity: 10, rate: 0.1 },
              ];
              onChange("discounts", newDiscounts);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + 할인 추가
          </button>
        </div>
      </div>
    </>
  );
}
