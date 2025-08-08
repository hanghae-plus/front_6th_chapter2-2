import {
  useProductForm,
  ProductWithUI,
  ProductFormFields,
} from "@entities/product";
import { useGlobalNotification } from "@entities/notification";
import { Button } from "@shared";

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
  const { showErrorNotification } = useGlobalNotification();
  const { product, errors, handleFieldChange, handleSubmit } = useProductForm({
    initialProduct,
    onSubmit,
  });

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">상품 수정</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProductFormFields
          product={product}
          onChange={handleFieldChange}
          errors={errors}
          onValidationError={(message) => showErrorNotification(message)}
        />

        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            수정
          </Button>
        </div>
      </form>
    </div>
  );
}
