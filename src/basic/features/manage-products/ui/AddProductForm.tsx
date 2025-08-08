import {
  useProductForm,
  ProductWithUI,
  ProductFormFields,
} from "@entities/product";
import { useGlobalNotification } from "@entities/notification";
import { Button } from "@shared";

interface AddProductFormProps {
  onSubmit: (product: Omit<ProductWithUI, "id">) => void;
  onCancel: () => void;
}

export function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
  const { showErrorNotification } = useGlobalNotification();
  const { product, errors, handleFieldChange, handleSubmit } = useProductForm({
    onSubmit,
  });

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">새 상품 추가</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProductFormFields
          product={product}
          onChange={handleFieldChange}
          errors={errors}
          onValidationError={(message) => showErrorNotification(message)}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            추가
          </Button>
        </div>
      </form>
    </div>
  );
}
