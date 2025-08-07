import { useEffect, useState } from "react";
import { Product } from "../../types";
import { initialProducts } from "../data";
import { useLocalStorage } from "./useLocalStorage";
// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려) ㅇ
// 2. 상품 CRUD 작업 ㅇ
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열 ㅇ
// - updateProduct: 상품 정보 수정 ㅇ
// - addProduct: 새 상품 추가 ㅇ
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>({
    key: "products",
    initialValue: initialProducts,
  });

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
