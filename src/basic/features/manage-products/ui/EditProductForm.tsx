import { useProductForm } from "../../../entities/product/hooks/useProductForm";
import { ProductWithUI } from "../../../entities/product/types";
import { ProductFormFields } from "../../../entities/product/ui/ProductFormFields";

interface EditProductFormProps {
  initialProduct: ProductWithUI;
  onSubmit: (product: ProductWithUI) => void;
  onCancel: () => void;
}

export function EditProductForm({
  initialProduct,
  onSubmit,
  onCancel,
}: EditProductFormProps) {
  const { product, errors, handleFieldChange, handleSubmit } = useProductForm({
    onSubmit,
    initialProduct,
  });

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">상품 수정</h3>

        <ProductFormFields
          product={product}
          onChange={handleFieldChange}
          errors={errors}
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
            수정
          </button>
        </div>
      </form>
    </div>
  );
}
