import { useState, useCallback } from "react";
import { ProductWithUI, useProductActions } from "@entities/product";
import {
  useGlobalNotification,
  NotificationVariant,
} from "@entities/notification";

export function useManageProducts() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(
    null
  );
  const { addNotification } = useGlobalNotification();

  const productActions = useProductActions({
    onAddProduct: () => {
      setShowProductForm(false);
    },
    onUpdateProduct: () => {
      setEditingProduct(null);
      setShowProductForm(false);
    },
    onNotify: (message, type) => {
      const variant =
        type === "success"
          ? NotificationVariant.SUCCESS
          : NotificationVariant.ERROR;
      addNotification(message, variant);
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
