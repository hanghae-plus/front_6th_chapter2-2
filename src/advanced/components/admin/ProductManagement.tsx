import React from "react";
import { Button } from "../ui/button/Button";
import { ProductTable } from "../product/ProductTable";
import { ProductForm } from "../product/ProductForm";
import type { ProductFormState, NotificationType } from "../../types/admin";
import type { CartItem, Product } from "../../../types";

interface ProductManagementProps {
  products: Product[];
  cart: CartItem[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
  showProductForm: boolean;
  productForm: ProductFormState;
  updateField: (field: keyof ProductFormState, value: string | number | any[]) => void;
  editingProduct: string | null;
  onProductSubmit: (e: React.FormEvent) => void;
  onCancelProductForm: () => void;
  addNotification: (message: string, type: NotificationType) => void;
}

export const ProductManagement = ({
  products,
  cart,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  showProductForm,
  productForm,
  updateField,
  editingProduct,
  onProductSubmit,
  onCancelProductForm,
  addNotification,
}: ProductManagementProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={onAddProduct} className="bg-gray-900 hover:bg-gray-800">
            새 상품 추가
          </Button>
        </div>
      </div>

      {/* 상품 테이블 */}
      <ProductTable products={products} cart={cart} onEdit={onEditProduct} onDelete={onDeleteProduct} />

      {/* 상품 폼 */}
      {showProductForm && (
        <ProductForm
          productForm={productForm}
          updateField={updateField}
          editingProduct={editingProduct}
          onSubmit={onProductSubmit}
          onCancel={onCancelProductForm}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductManagement;
