import { useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { useProducts } from "./useProducts";
import { BaseHandlerProps } from "../../types/common";

interface UseProductHandlersProps extends BaseHandlerProps {}

/**
 * 상품 관련 핸들러들을 제공하는 훅
 */
export const useProductHandlers = ({
  addNotification,
}: UseProductHandlersProps) => {
  const {
    products,
    addProduct: addProductAction,
    updateProduct: updateProductAction,
    deleteProduct: deleteProductAction,
    findProduct,
  } = useProducts();

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = addProductAction(newProduct);
      addNotification(result.message, result.type);
    },
    [addProductAction, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = updateProductAction(productId, updates);
      addNotification(result.message, result.type);
    },
    [updateProductAction, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const result = deleteProductAction(productId);
      addNotification(result.message, result.type);
    },
    [deleteProductAction, addNotification]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    findProduct,
  };
};
