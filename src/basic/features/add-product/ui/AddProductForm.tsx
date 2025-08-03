import { useState } from "react";
import { Product } from "../../../entities/product/types";
import { ProductFormFields } from "../../../entities/product/ui/ProductFormFields";
import { NotificationVariant } from "../../../entities/notification/types";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface AddProductFormProps {
  onSubmit: (product: Omit<ProductWithUI, "id">) => void;
  onCancel: () => void;
  addNotification: (message: string, variant?: NotificationVariant) => void;
}

export function AddProductForm({
  onSubmit,
  onCancel,
  addNotification,
}: AddProductFormProps) {
  const [product, setProduct] = useState<Partial<ProductWithUI>>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateProduct = (product: Partial<ProductWithUI>): boolean => {
    const newErrors: Record<string, string> = {};

    if (!product.name?.trim()) {
      newErrors.name = "상품명은 필수입니다";
    }

    if (!product.price || product.price <= 0) {
      newErrors.price = "가격은 0보다 커야 합니다";
    }

    if (product.stock === undefined || product.stock < 0) {
      newErrors.stock = "재고는 0 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 클리어
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateProduct(product)) {
      onSubmit(product as Omit<ProductWithUI, "id">);
    }
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">새 상품 추가</h3>

        <ProductFormFields
          product={product}
          onChange={handleFieldChange}
          errors={errors}
          addNotification={addNotification}
        />

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
            추가
          </button>
        </div>
      </form>
    </div>
  );
}
