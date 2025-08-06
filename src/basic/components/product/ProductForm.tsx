import React from "react";
import { Button } from "../ui/button/Button";
import { Input } from "../ui/input/Input";
import { DiscountItem } from "./DiscountItem";
import { ProductFormState } from "../../types/admin";

interface ProductFormProps {
  productForm: ProductFormState;
  updateField: (field: keyof ProductFormState, value: string | number | any[]) => void;
  editingProduct: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const ProductForm = ({
  productForm,
  updateField,
  editingProduct,
  onSubmit,
  onCancel,
  addNotification,
}: ProductFormProps) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      updateField("price", value === "" ? 0 : parseInt(value));
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      updateField("price", 0);
    } else if (parseInt(value) < 0) {
      addNotification("가격은 0보다 커야 합니다", "error");
      updateField("price", 0);
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      updateField("stock", value === "" ? 0 : parseInt(value));
    }
  };

  const handleStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      updateField("stock", 0);
    } else if (parseInt(value) < 0) {
      addNotification("재고는 0보다 커야 합니다", "error");
      updateField("stock", 0);
    } else if (parseInt(value) > 9999) {
      addNotification("재고는 9999개를 초과할 수 없습니다", "error");
      updateField("stock", 9999);
    }
  };

  const handleDiscountQuantityChange = (index: number, quantity: number) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index].quantity = quantity;
    updateField("discounts", newDiscounts);
  };

  const handleDiscountRateChange = (index: number, rate: number) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index].rate = rate;
    updateField("discounts", newDiscounts);
  };

  const handleDiscountRemove = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    updateField("discounts", newDiscounts);
  };

  const handleAddDiscount = () => {
    updateField("discounts", [...productForm.discounts, { quantity: 10, rate: 0.1 }]);
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{editingProduct === "new" ? "새 상품 추가" : "상품 수정"}</h3>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="상품명"
            type="text"
            value={productForm.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />

          <Input
            label="설명"
            type="text"
            value={productForm.description}
            onChange={(e) => updateField("description", e.target.value)}
          />

          <Input
            label="가격"
            type="text"
            value={productForm.price === 0 ? "" : productForm.price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder="숫자만 입력"
            required
          />

          <Input
            label="재고"
            type="text"
            value={productForm.stock === 0 ? "" : productForm.stock}
            onChange={handleStockChange}
            onBlur={handleStockBlur}
            placeholder="숫자만 입력"
            required
          />
        </div>

        {/* 할인 정책 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <DiscountItem
                key={index}
                discount={discount}
                index={index}
                onQuantityChange={handleDiscountQuantityChange}
                onRateChange={handleDiscountRateChange}
                onRemove={handleDiscountRemove}
              />
            ))}
            <button type="button" onClick={handleAddDiscount} className="text-sm text-indigo-600 hover:text-indigo-800">
              + 할인 추가
            </button>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">{editingProduct === "new" ? "추가" : "수정"}</Button>
        </div>
      </form>
    </div>
  );
};
