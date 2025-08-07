import { useCallback, useMemo } from "react";
import { useLocalStorage } from "../../_shared/utility-hooks/use-local-storage";
import { initialProducts } from "./mock";
import { ProductWithUI } from "./types";

export const useProducts = (params?: { searchTerm?: string }) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const filteredProducts = useMemo(
    () =>
      params?.searchTerm
        ? products.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(params.searchTerm!.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(params.searchTerm!.toLowerCase()))
          )
        : products,
    [products, params?.searchTerm]
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    [setProducts]
  );

  return {
    products: filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
