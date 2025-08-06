import { useCallback, useState } from "react";
import { ProductWithUI } from "./product.types";
import { initialProducts } from "./product.constants";
import { NotificationType } from "../../hooks/useNotifications";
import { useLocalStorageState } from "../../utils/hooks/useLocalStorageState";
import { productModel } from "./product.model";

export const useProducts = (
  addNotification: (message: string, type: NotificationType) => void
) => {
  const [products, setProducts] = useLocalStorageState<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      setProducts((prev) => productModel.addProduct(prev, newProduct));
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        productModel.updateProduct(prev, productId, updates)
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => productModel.deleteProduct(prev, productId));
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
