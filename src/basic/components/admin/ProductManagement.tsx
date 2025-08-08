import React from "react";
import { Button } from "../ui/button/Button";
import { ProductTable } from "../product/ProductTable";
import { ProductForm } from "../product/ProductForm";
import type { NotificationType } from "../../types/admin";

// hooks
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { useProductForm } from "../../hooks/useProductForm";

interface ProductManagementProps {
  addNotification: (message: string, type: NotificationType) => void;
}

export const ProductManagement = ({ addNotification }: ProductManagementProps) => {
  // NotificationType을 훅에서 기대하는 타입으로 변환
  const handleNotification = (message: string, type?: "success" | "error" | "warning") => {
    if (type === "success" || type === "error") {
      addNotification(message, type);
    }
  };

  const { products, addProduct, updateProduct, deleteProduct } = useProducts(handleNotification);
  const { cart } = useCart(handleNotification);
  const {
    editingProduct,
    productForm,
    showProductForm,
    updateField: updateProductField,
    startEditProduct,
    startAddProduct,
    cancelProductForm,
    handleProductSubmit,
  } = useProductForm();

  // Product Form 제출 처리
  const handleProductFormSubmit = (e: React.FormEvent) => {
    handleProductSubmit(e, addProduct, updateProduct);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={startAddProduct} className="bg-gray-900 hover:bg-gray-800">
            새 상품 추가
          </Button>
        </div>
      </div>

      {/* 상품 테이블 */}
      <ProductTable products={products} cart={cart} onEdit={startEditProduct} onDelete={deleteProduct} />

      {/* 상품 폼 */}
      {showProductForm && (
        <ProductForm
          productForm={productForm}
          updateField={updateProductField}
          editingProduct={editingProduct}
          onSubmit={handleProductFormSubmit}
          onCancel={cancelProductForm}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductManagement;
