import { type ChangeEvent, type FocusEvent, type FormEvent } from "react";

import { Button, SearchInput } from "../../../shared";
import { Discount, type ProductForm } from "../types";
import { DiscountSection } from "./DiscountSection";

type ProductFormEditorProps = {
  productForm: ProductForm;
  editingProduct: string | null;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  onFormChange: (form: ProductForm) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export function ProductFormEditor({
  productForm,
  editingProduct,
  onSubmit,
  onCancel,
  onFormChange,
  addNotification
}: ProductFormEditorProps) {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFormChange({ ...productForm, name: e.target.value });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFormChange({ ...productForm, description: e.target.value });
  };

  const handleDiscountsChange = (discounts: Discount[]) => {
    onFormChange({ ...productForm, discounts });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      onFormChange({
        ...productForm,
        price: value === "" ? 0 : parseInt(value)
      });
    }
  };

  const handlePriceBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      onFormChange({ ...productForm, price: 0 });
    } else if (parseInt(value) < 0) {
      addNotification("가격은 0보다 커야 합니다", "error");
      onFormChange({ ...productForm, price: 0 });
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      onFormChange({
        ...productForm,
        stock: value === "" ? 0 : parseInt(value)
      });
    }
  };

  const handleStockBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      onFormChange({ ...productForm, stock: 0 });
    } else if (parseInt(value) < 0) {
      addNotification("재고는 0보다 커야 합니다", "error");
      onFormChange({ ...productForm, stock: 0 });
    } else if (parseInt(value) > 9999) {
      addNotification("재고는 9999개를 초과할 수 없습니다", "error");
      onFormChange({ ...productForm, stock: 9999 });
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <SearchInput
              label="상품명"
              value={productForm.name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div>
            <SearchInput
              label="설명"
              value={productForm.description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div>
            <SearchInput
              label="가격"
              value={productForm.price === 0 ? "" : productForm.price}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <SearchInput
              label="재고"
              value={productForm.stock === 0 ? "" : productForm.stock}
              onChange={handleStockChange}
              onBlur={handleStockBlur}
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>

        <DiscountSection discounts={productForm.discounts} onChange={handleDiscountsChange} />

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} color="secondary">
            취소
          </Button>
          <Button type="submit" color="primary">
            {editingProduct === "new" ? "추가" : "수정"}
          </Button>
        </div>
      </form>
    </div>
  );
}
