import { useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { useProducts } from "./useProducts";
import { BaseHandlerProps } from "../../types/common";

interface UseProductHandlersProps extends BaseHandlerProps {}

/**
 * 상품 관련 핸들러들을 제공하는 훅 (네임스페이스 구조)
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

  const add = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = addProductAction(newProduct);
      addNotification(result.message, result.type);
    },
    [addProductAction, addNotification]
  );

  const update = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = updateProductAction(productId, updates);
      addNotification(result.message, result.type);
    },
    [updateProductAction, addNotification]
  );

  const remove = useCallback(
    (productId: string) => {
      const result = deleteProductAction(productId);
      addNotification(result.message, result.type);
    },
    [deleteProductAction, addNotification]
  );

  const find = useCallback(
    (productId: string) => {
      return findProduct(productId);
    },
    [findProduct]
  );

  return {
    // 네임스페이스 구조
    state: {
      items: products,
    },
    actions: {
      add,
      update,
      remove,
      find,
    },

    // 하위 호환성을 위해 기존 방식도 유지
    products,
    addProduct: add,
    updateProduct: update,
    deleteProduct: remove,
    findProduct: find,
  };
};
