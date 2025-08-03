import { ProductWithUI } from "../../../entities/product/types";
import { ProductFormFields } from "../../../entities/product/ui/ProductFormFields";
import { NotificationVariant } from "../../../entities/notification/types";
import { useProductForm } from "../../../entities/product/hooks/useProductForm";

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
  const { product, errors, handleFieldChange, handleSubmit } = useProductForm({
    onSubmit,
  });

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
