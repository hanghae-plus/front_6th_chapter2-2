import { useState, useEffect, useCallback } from "react";
import { Discount } from "../../types";
import { initialProducts } from "../data";
import { ProductWithUI } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // 새 상품 추가
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

  // 상품 정보 수정
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

  // 재고 수정
  const updateProductStock = useCallback(
    (productId: string, newStock: number) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
    },
    []
  );

  // 상품 삭제
  const removeProduct = useCallback(
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

  // 할인 규칙 추가
  const addProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, discounts: [...product.discounts, discount] }
            : product
        )
      );
    },
    []
  );

  // 할인 규칙 삭제
  const removeProductDiscount = useCallback(
    (productId: string, discountIdx: number) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                discounts: product.discounts.filter(
                  (_, idx) => idx !== discountIdx
                ),
              }
            : product
        )
      );
    },
    []
  );

  return {
    products,
    updateProduct,
    addProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
    removeProduct,
  };
}
