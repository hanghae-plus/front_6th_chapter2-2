import { useCallback } from "react";

import useFilterSearchParams from "../../hooks/useFilterSearchParams";
import { Product } from "../../types";
import { initialProducts } from "../constants/product";
import { generateProductId, validateProductData } from "../utils/productUtils";
import { useLocalStorage } from "./useLocalStorage";

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<Product[]>(
    "products",
    initialProducts
  );

  const { filterSearchParams } = useFilterSearchParams();

  // 상품 추가
  const addProduct = useCallback((productData: Omit<Product, "id">) => {
    if (!validateProductData(productData)) {
      throw new Error("Invalid product data");
    }

    const newProduct: Product = {
      ...productData,
      id: generateProductId(),
    };

    setProducts((prev: Product[]) => [...prev, newProduct]);
    return newProduct;
  }, []);

  // 상품 수정
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev: Product[]) =>
      prev.map((product: Product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // 상품 삭제
  const removeProduct = useCallback((id: string) => {
    setProducts((prev: Product[]) =>
      prev.filter((product: Product) => product.id !== id)
    );
  }, []);

  const filteredProducts = filterSearchParams.searchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(filterSearchParams.searchTerm?.toLowerCase() ?? "") ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(filterSearchParams.searchTerm?.toLowerCase() ?? ""))
      )
    : products;

  return {
    products,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    removeProduct,
  };
};
