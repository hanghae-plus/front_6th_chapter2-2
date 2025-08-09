import { useCallback } from "react";
import { Product } from "../../types";
import { useAtom } from "jotai";
import { productsAtom } from "../models/product";
import {
  filterProducts,
  generateProductId,
  validateProductData,
} from "../utils/productUtils";
import useFilterSearchParams from "../../hooks/useFilterSearchParams";

export const useProducts = () => {
  const [products, setProducts] = useAtom<Product[]>(productsAtom);
  const { filterSearchParams } = useFilterSearchParams();

  // 상품 추가
  const addProduct = useCallback(
    (productData: Omit<Product, "id">) => {
      if (!validateProductData(productData)) {
        throw new Error("Invalid product data");
      }

      const newProduct: Product = {
        ...productData,
        id: generateProductId(),
      };

      setProducts((prev: Product[]) => [...prev, newProduct]);
      return newProduct;
    },
    [setProducts]
  );

  // 상품 수정
  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev: Product[]) =>
        prev.map((product: Product) =>
          product.id === id ? { ...product, ...updates } : product
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

  // 상품 삭제
  const removeProduct = useCallback(
    (id: string) => {
      setProducts((prev: Product[]) =>
        prev.filter((product: Product) => product.id !== id)
      );
    },
    [setProducts]
  );

  const filteredProducts = filterProducts(products, filterSearchParams);

  return {
    products,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    removeProduct,
  };
};
