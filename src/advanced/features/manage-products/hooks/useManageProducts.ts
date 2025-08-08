import { useState, useCallback } from "react";
import { ProductWithUI, useProductActions } from "@entities/product";
import { useGlobalNotification } from "@entities/notification";

export function useManageProducts() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(
    null
  );
  const { showSuccessNotification, showErrorNotification } =
    useGlobalNotification();

  const productActions = useProductActions({
    onAddProduct: () => {
      setShowProductForm(false);
    },
    onUpdateProduct: () => {
      setEditingProduct(null);
      setShowProductForm(false);
    },
    onNotify: (message, type) => {
      type === "success"
        ? showSuccessNotification(message)
        : showErrorNotification(message);
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
    showProductForm,
    editingProduct,

    ...productActions,

    startAddingProduct,
    startEditingProduct,
    cancelProductForm,
  };
}
