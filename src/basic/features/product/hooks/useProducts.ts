import { useCallback } from "react";

import { productData } from "@/basic/features/product/data/product.data";
import { ProductWithUI } from "@/basic/features/product/types/product";
import { useLocalStorage } from "@/basic/shared/hooks/useLocalStorage";

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    productData.initialProducts
  );

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    []
  );

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  return { products, addProduct, updateProduct, deleteProduct };
}
