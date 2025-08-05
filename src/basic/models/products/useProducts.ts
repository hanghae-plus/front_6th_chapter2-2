import { useCallback, useState } from "react";
import { ProductWithUI } from "./types";
import { initialProducts } from "./constants";
import { NotificationType } from "../../hooks/useNotifications";
import { useLocalStorageState } from "../../utils/hooks/useLocalStorageState";

export const useProducts = (
  addNotification: (message: string, type: NotificationType) => void
) => {
  const [products, setProducts] = useLocalStorageState<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
