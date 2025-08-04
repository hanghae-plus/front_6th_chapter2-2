// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열
// - updateProduct: 상품 정보 수정
// - addProduct: 새 상품 추가
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제

import { useState, useEffect, useCallback } from "react";
import { Product, Discount } from "../../types";
import { initialProducts } from "../constants";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
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

  // 상품 정보 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    []
  );

  // 새 상품 추가
  const addProduct = useCallback((newProduct: Omit<Product, "id">) => {
    const product: Product = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  }, []);

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
  const removeProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

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
