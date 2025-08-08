import { ProductWithUI } from "@entities/product";
import CloseIcon from "@assets/icons/CloseIcon.svg?react";
import { useCallback } from "react";
import { Button } from "@shared";
import {
  validatePrice,
  validateStock,
  validateProductName,
} from "../libs/validator";

interface ProductFormFieldsProps {
  product: Partial<ProductWithUI>;
  onChange: (field: keyof ProductWithUI, value: any) => void;
  errors?: Record<string, string>;
  onValidationError?: (message: string) => void;
}

export function ProductFormFields({
  product,
  onChange,
  errors = {},
  onValidationError,
}: ProductFormFieldsProps) {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const validation = validateProductName(value);

      if (!validation.isValid && validation.errorMessage) {
        onValidationError?.(validation.errorMessage);
      }

      onChange("name", value);
    },
    [onChange, onValidationError]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange("description", e.target.value);
    },
    [onChange]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        onChange("price", value === "" ? 0 : parseInt(value));
      }
    },
    [onChange]
  );

  const handlePriceBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numValue = value === "" ? 0 : parseInt(value);

      const validation = validatePrice(numValue);
      if (!validation.isValid && validation.errorMessage) {
        onValidationError?.(validation.errorMessage);
        onChange("price", validation.correctedValue ?? 0);
      } else {
        onChange("price", numValue);
      }
    },
    [onChange, onValidationError]
  );

  const handleStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        onChange("stock", value === "" ? 0 : parseInt(value));
      }
    },
    [onChange]
  );

  const handleStockBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numValue = value === "" ? 0 : parseInt(value);

      const validation = validateStock(numValue);
      if (!validation.isValid && validation.errorMessage) {
        onValidationError?.(validation.errorMessage);
        onChange("stock", validation.correctedValue ?? 0);
      } else {
        onChange("stock", numValue);
      }
    },
    [onChange, onValidationError]
  );

  const handleDiscountQuantityChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...(product.discounts || [])];
      newDiscounts[index].quantity = parseInt(e.target.value) || 0;
      onChange("discounts", newDiscounts);
    },
    [product.discounts, onChange]
  );

  const handleDiscountRateChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...(product.discounts || [])];
      newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
      onChange("discounts", newDiscounts);
    },
    [product.discounts, onChange]
  );

  const handleDiscountRateBlur = useCallback(
    (index: number, e: React.FocusEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      const newDiscounts = [...(product.discounts || [])];

      if (value > 100) {
        onValidationError?.("할인율은 100%를 초과할 수 없습니다");
        newDiscounts[index].rate = 1.0;
        onChange("discounts", newDiscounts);
      } else if (value < 0) {
        onValidationError?.("할인율은 0% 미만일 수 없습니다");
        newDiscounts[index].rate = 0.0;
        onChange("discounts", newDiscounts);
      }
    },
    [product.discounts, onChange, onValidationError]
  );

  const handleRemoveDiscount = useCallback(
    (index: number) => {
      const newDiscounts = (product.discounts || []).filter(
        (_, i) => i !== index
      );
      onChange("discounts", newDiscounts);
    },
    [product.discounts, onChange]
  );

  const handleAddDiscount = useCallback(() => {
    const newDiscounts = [
      ...(product.discounts || []),
      { quantity: 10, rate: 0.1 },
    ];
    onChange("discounts", newDiscounts);
  }, [product.discounts, onChange]);

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
            onChange={handleNameChange}
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
            onChange={handleDescriptionChange}
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
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
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
            onChange={handleStockChange}
            onBlur={handleStockBlur}
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
                onChange={(e) => handleDiscountQuantityChange(index, e)}
                className="w-20 px-2 py-1 border rounded"
                min="1"
                placeholder="수량"
              />
              <span className="text-sm">개 이상 구매 시</span>
              <input
                type="number"
                value={discount.rate * 100}
                onChange={(e) => handleDiscountRateChange(index, e)}
                onBlur={(e) => handleDiscountRateBlur(index, e)}
                className="w-16 px-2 py-1 border rounded"
                min="0"
                max="100"
                placeholder="%"
              />
              <span className="text-sm">% 할인</span>
              <Button
                type="button"
                variant="icon"
                onClick={() => handleRemoveDiscount(index)}
                className="text-red-600 hover:text-red-800"
              >
                <CloseIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="link"
            onClick={handleAddDiscount}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + 할인 추가
          </Button>
        </div>
      </div>
    </>
  );
}
