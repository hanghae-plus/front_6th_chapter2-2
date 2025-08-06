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

import { useCallback, useState } from "react";
import { Product } from "../../types";

// - removeProductDiscount: 할인 규칙 삭제
interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// addNotification 타입 지정
type AddNotificationFn = (
  message: string,
  type?: "error" | "success" | "warning"
) => void;

export function useProducts(addNotification: AddNotificationFn) {
  // 초기 데이터
  const initialProducts: ProductWithUI[] = [
    {
      id: "p1",
      name: "상품1",
      price: 10000,
      stock: 20,
      discounts: [
        { quantity: 10, rate: 0.1 },
        { quantity: 20, rate: 0.2 },
      ],
      description: "최고급 품질의 프리미엄 상품입니다.",
    },
    {
      id: "p2",
      name: "상품2",
      price: 20000,
      stock: 20,
      discounts: [{ quantity: 10, rate: 0.15 }],
      description: "다양한 기능을 갖춘 실용적인 상품입니다.",
      isRecommended: true,
    },
    {
      id: "p3",
      name: "상품3",
      price: 30000,
      stock: 20,
      discounts: [
        { quantity: 10, rate: 0.2 },
        { quantity: 30, rate: 0.25 },
      ],
      description: "대용량과 고성능을 자랑하는 상품입니다.",
    },
  ];
  // TODO: 구현
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

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts(prev => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  return { products, setProducts, addProduct, updateProduct, deleteProduct };
}
