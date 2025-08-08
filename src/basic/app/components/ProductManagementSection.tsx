import { type FormEvent } from "react";

import {
  type ProductForm,
  ProductFormEditor,
  ProductTable,
  type ProductWithUI
} from "../../domains/product";
import { Button } from "../../shared";

type ProductManagementSectionProps = {
  products: ProductWithUI[];
  productForm: ProductForm;
  editingProduct: string | null;
  showProductForm: boolean;
  formatPrice: (price: number, productId?: string) => string;
  onAddNew: () => void;
  onEdit: (product: ProductWithUI) => void;
  onDelete: (productId: string) => void;
  onFormSubmit: (e: FormEvent) => void;
  onFormCancel: () => void;
  onFormChange: (form: ProductForm) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export function ProductManagementSection({
  products,
  productForm,
  editingProduct,
  showProductForm,
  formatPrice,
  onAddNew,
  onEdit,
  onDelete,
  onFormSubmit,
  onFormCancel,
  onFormChange,
  addNotification
}: ProductManagementSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={onAddNew} color="dark" className="rounded-md text-sm">
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductTable
        products={products}
        formatPrice={formatPrice}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {showProductForm && (
        <ProductFormEditor
          productForm={productForm}
          editingProduct={editingProduct}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
          onFormChange={onFormChange}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}
