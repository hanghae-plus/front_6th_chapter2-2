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

import { useCallback } from "react";
import { useAtom } from "jotai";
import { Discount } from "../type/types";
import { ProductWithUI } from "../type/types";
import { productsAtom } from "../stores";

interface UseProductsProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

/**
 * 상품 관리 관련 상태와 로직을 관리하는 훅
 *
 * 주요 기능:
 * 1. 상품 목록 상태 관리 (localStorage 연동)
 * 2. 상품 CRUD 작업 (추가, 수정, 삭제)
 * 3. 재고 업데이트
 * 4. 할인 규칙 관리
 * 5. 상품 검색 및 필터링
 *
 * @param addNotification 알림 메시지 표시 함수
 * @returns 상품 관련 상태와 함수들
 */
export const useProducts = ({ addNotification }: UseProductsProps) => {
  // 상품 목록 상태 (Jotai atom 사용)
  const [products, setProducts] = useAtom(productsAtom);

  // 상품 추가
  // 새로운 상품을 목록에 추가하고 유효성 검증을 수행
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      // 상품명 중복 검사
      const isDuplicate = products.some(
        (product) => product.name === newProduct.name
      );
      if (isDuplicate) {
        addNotification("이미 존재하는 상품명입니다.", "error");
        return;
      }

      // 유효성 검증
      if (!newProduct.name.trim()) {
        addNotification("상품명을 입력해주세요.", "error");
        return;
      }
      if (newProduct.price <= 0) {
        addNotification("가격은 0보다 커야 합니다.", "error");
        return;
      }
      if (newProduct.stock < 0) {
        addNotification("재고는 0 이상이어야 합니다.", "error");
        return;
      }

      // 새 상품 생성 (ID 자동 생성)
      const productToAdd: ProductWithUI = {
        ...newProduct,
        id: Date.now().toString(),
      };

      setProducts((prevProducts) => [...prevProducts, productToAdd]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [products, addNotification]
  );

  // 상품 정보 수정
  // 기존 상품의 정보를 업데이트
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const productExists = products.some(
        (product) => product.id === productId
      );
      if (!productExists) {
        addNotification("상품을 찾을 수 없습니다.", "error");
        return;
      }

      // 상품명 변경 시 중복 검사
      if (updates.name) {
        const isDuplicate = products.some(
          (product) => product.id !== productId && product.name === updates.name
        );
        if (isDuplicate) {
          addNotification("이미 존재하는 상품명입니다.", "error");
          return;
        }
      }

      // 유효성 검증
      if (updates.price !== undefined && updates.price <= 0) {
        addNotification("가격은 0보다 커야 합니다.", "error");
        return;
      }
      if (updates.stock !== undefined && updates.stock < 0) {
        addNotification("재고는 0 이상이어야 합니다.", "error");
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품 정보가 수정되었습니다.", "success");
    },
    [products, addNotification]
  );

  // 상품 삭제
  const removeProduct = useCallback(
    (productId: string) => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // 재고 업데이트
  // 특정 상품의 재고 수량을 변경
  const updateProductStock = useCallback(
    (productId: string, newStock: number) => {
      if (newStock < 0) {
        addNotification("재고는 0 이상이어야 합니다.", "error");
        return;
      }

      const productExists = products.some(
        (product) => product.id === productId
      );
      if (!productExists) {
        addNotification("상품을 찾을 수 없습니다.", "error");
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
      addNotification("재고가 업데이트되었습니다.", "success");
    },
    [products, addNotification]
  );

  // 할인 규칙 추가
  // 특정 상품에 새로운 할인 규칙을 추가
  const addProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      if (discount.quantity <= 0) {
        addNotification("할인 적용 수량은 0보다 커야 합니다.", "error");
        return;
      }
      if (discount.rate <= 0 || discount.rate > 1) {
        addNotification("할인율은 0과 1 사이의 값이어야 합니다.", "error");
        return;
      }

      const productExists = products.some(
        (product) => product.id === productId
      );
      if (!productExists) {
        addNotification("상품을 찾을 수 없습니다.", "error");
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                discounts: [...product.discounts, discount].sort(
                  (a, b) => a.quantity - b.quantity
                ),
              }
            : product
        )
      );
      addNotification("할인 규칙이 추가되었습니다.", "success");
    },
    [products, addNotification]
  );

  // 할인 규칙 제거
  // 특정 상품의 할인 규칙을 제거
  const removeProductDiscount = useCallback(
    (productId: string, discountIndex: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        addNotification("상품을 찾을 수 없습니다.", "error");
        return;
      }
      if (discountIndex < 0 || discountIndex >= product.discounts.length) {
        addNotification("유효하지 않은 할인 규칙입니다.", "error");
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                discounts: product.discounts.filter(
                  (_, index) => index !== discountIndex
                ),
              }
            : product
        )
      );
      addNotification("할인 규칙이 삭제되었습니다.", "success");
    },
    [products, addNotification]
  );

  // 상품 검색
  // 상품명으로 상품을 찾아 반환
  const findProduct = useCallback(
    (productId: string): ProductWithUI | undefined => {
      return products.find((product) => product.id === productId);
    },
    [products]
  );

  return {
    // 상태값
    products,

    // 상품 관리 함수들
    addProduct,
    updateProduct,
    removeProduct,
    findProduct,

    // 재고 관리 함수들
    updateProductStock,

    // 할인 관리 함수들
    addProductDiscount,
    removeProductDiscount,
  };
};
