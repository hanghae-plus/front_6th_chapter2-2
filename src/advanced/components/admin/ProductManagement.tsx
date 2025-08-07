// 상품 관리 섹션 컴포넌트 (기존 AdminPage 구조 유지)
import React from "react";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { getDisplayPrice } from "../../utils/price";
import { useProductForm } from "../../hooks/useProductForm";
import { CartItem, Product, ProductWithUI } from "../../type/types";

interface ProductManagementProps {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  removeProduct: (productId: string) => void;
  cart: CartItem[];
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ProductManagement({
  products,
  addProduct,
  updateProduct,
  removeProduct,
  cart,
  addNotification,
}: ProductManagementProps) {
  // 폼 상태 관리 로직을 hook으로 분리
  const {
    editingProduct,
    showProductForm,
    productForm,
    setProductForm,
    startAddProduct,
    startEditProduct,
    handleSubmit,
    handleCancel,
  } = useProductForm();

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);
    return remaining;
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    handleSubmit(e, addProduct, updateProduct);
  };

  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
    addNotification("상품이 삭제되었습니다", "success");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={startAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEditProduct={startEditProduct}
        onRemoveProduct={handleRemoveProduct}
        getRemainingStock={getRemainingStock}
        getDisplayPrice={getDisplayPrice}
      />

      <ProductForm
        isVisible={showProductForm}
        formData={productForm}
        onFormDataChange={setProductForm}
        onSubmit={handleProductSubmit}
        onCancel={handleCancel}
        editingProduct={editingProduct}
        addNotification={addNotification}
      />
    </section>
  );
}
