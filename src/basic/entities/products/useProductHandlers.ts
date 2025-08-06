import { useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { useProducts } from "./useProducts";

interface UseProductHandlersProps {
  addNotification: (
    message: string,
    type: "success" | "error" | "warning"
  ) => void;
}

export const useProductHandlers = ({
  addNotification,
}: UseProductHandlersProps) => {
  const {
    products,
    setProducts,
    addProduct: addProductAction,
    updateProduct: updateProductAction,
    deleteProduct: deleteProductAction,
  } = useProducts();

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = addProductAction(newProduct);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [addProductAction, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = updateProductAction(productId, updates);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [updateProductAction, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const result = deleteProductAction(productId);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [deleteProductAction, addNotification]
  );

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
