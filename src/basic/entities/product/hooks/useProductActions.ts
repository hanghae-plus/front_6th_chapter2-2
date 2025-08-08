import { useCallback } from "react";
import { ProductWithUI, useProductStorage } from "@entities/product";

interface UseProductActionsOptions {
  onAddProduct?: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct?: (product: ProductWithUI) => void;
  onDeleteProduct?: (productId: string) => void;
  onNotify?: (message: string, type: "success" | "error") => void;
}

export function useProductActions(options: UseProductActionsOptions = {}) {
  const { onAddProduct, onUpdateProduct, onDeleteProduct, onNotify } = options;
  const productStorage = useProductStorage();

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      productStorage.addProduct(newProduct);
      onNotify?.("상품이 추가되었습니다.", "success");
      onAddProduct?.(newProduct);
    },
    [productStorage.addProduct, onNotify, onAddProduct]
  );

  const updateProduct = useCallback(
    (updatedProduct: ProductWithUI) => {
      productStorage.updateProduct(updatedProduct);
      onNotify?.("상품이 수정되었습니다.", "success");
      onUpdateProduct?.(updatedProduct);
    },
    [productStorage.updateProduct, onNotify, onUpdateProduct]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      productStorage.deleteProduct(productId);
      onNotify?.("상품이 삭제되었습니다.", "success");
      onDeleteProduct?.(productId);
    },
    [productStorage.deleteProduct, onNotify, onDeleteProduct]
  );

  return {
    ...productStorage,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
