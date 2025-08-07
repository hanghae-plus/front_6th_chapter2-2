import { useCallback } from "react";
import {
  useGlobalNotification,
  NotificationVariant,
} from "@entities/notification";
import { ProductWithUI, useProductStorage } from "@entities/product";

interface UseProductActionsOptions {
  onAddProduct?: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct?: (product: ProductWithUI) => void;
  onDeleteProduct?: (productId: string) => void;
}

export function useProductActions(options: UseProductActionsOptions = {}) {
  const { onAddProduct, onUpdateProduct, onDeleteProduct } = options;
  const productStorage = useProductStorage();
  const { addNotification } = useGlobalNotification();

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      productStorage.addProduct(newProduct);
      addNotification("상품이 추가되었습니다.", NotificationVariant.SUCCESS);
      onAddProduct?.(newProduct);
    },
    [productStorage.addProduct, addNotification, onAddProduct]
  );

  const updateProduct = useCallback(
    (updatedProduct: ProductWithUI) => {
      productStorage.updateProduct(updatedProduct);
      addNotification("상품이 수정되었습니다.", NotificationVariant.SUCCESS);
      onUpdateProduct?.(updatedProduct);
    },
    [productStorage.updateProduct, addNotification, onUpdateProduct]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      productStorage.deleteProduct(productId);
      addNotification("상품이 삭제되었습니다.", NotificationVariant.SUCCESS);
      onDeleteProduct?.(productId);
    },
    [productStorage.deleteProduct, addNotification, onDeleteProduct]
  );

  return {
    ...productStorage,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
