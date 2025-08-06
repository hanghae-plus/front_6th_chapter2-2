import { useCallback } from "react";
import { ProductWithUI } from "../types";
import { useLocalStorage } from "./useLocalStorage";
import { initialProducts } from "../data/initialData";

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (
      newProduct: Omit<ProductWithUI, "id">,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (
      productId: string,
      updates: Partial<ProductWithUI>,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (
      productId: string,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [setProducts]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
