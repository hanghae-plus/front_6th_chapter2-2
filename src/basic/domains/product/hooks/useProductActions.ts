import type { Dispatch, SetStateAction } from "react";

import type { ProductForm, ProductWithUI } from "../types";

interface UseProductActionsParams {
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
}

export function useProductActions({ setProducts, addNotification }: UseProductActionsParams) {
  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts((prev) => [...prev, product]);
    addNotification("상품이 추가되었습니다.", "success");
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
    addNotification("상품이 수정되었습니다.", "success");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addNotification("상품이 삭제되었습니다.", "success");
  };

  const handleProductSubmit = (
    productForm: ProductForm,
    editingProduct: string | null,
    resetForm: () => void,
    setEditingProduct: (id: string | null) => void,
    setShowForm: (show: boolean) => void
  ) => {
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts
      });
    }
    resetForm();
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEditProduct = (
    product: ProductWithUI,
    setEditingProduct: (id: string) => void,
    setProductForm: (form: ProductForm) => void,
    setShowForm: (show: boolean) => void
  ) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || []
    });
    setShowForm(true);
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    handleProductSubmit,
    startEditProduct
  };
}
