import { useState, useCallback } from "react";
import { ProductWithUI, useProductActions } from "@entities/product";

export function useManageProducts() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(
    null
  );

  const productActions = useProductActions({
    onAddProduct: () => {
      setShowProductForm(false);
    },
    onUpdateProduct: () => {
      setEditingProduct(null);
      setShowProductForm(false);
    },
  });

  const startAddingProduct = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(true);
  }, []);

  const startEditingProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const cancelProductForm = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  return {
    // 상태
    showProductForm,
    editingProduct,

    // 상품 데이터 및 액션
    ...productActions,

    // UI 액션
    startAddingProduct,
    startEditingProduct,
    cancelProductForm,
  };
}
