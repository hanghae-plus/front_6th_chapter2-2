import { useState, useEffect, useCallback } from "react";
import { ProductWithUI } from "../types";
import { INITIAL_PRODUCTS } from "../constants";

export function useProducts(
  addNotification?: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) {
  // 상품 상태 (localStorage에서 복원)
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // 새 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification?.("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 정보 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification?.("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification?.("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // 검색어로 필터링된 상품 목록
  const getFilteredProducts = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) return products;

      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    },
    [products]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
  };
}
