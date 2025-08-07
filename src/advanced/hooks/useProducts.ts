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

import { useLocalStorage } from '../utils/hooks/useLocalStorage.ts';
import { initialProducts, ProductWithUI } from '../constants';
import { useCallback, useEffect } from 'react';

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };

      setProducts((prev) => [...prev, product]);
      return {
        success: {
          type: '',
          message: '상품이 추가되었습니다.',
        },
      };
    },
    [setProducts],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
      );
      return {
        success: {
          type: '',
          message: '상품이 수정되었습니다.',
        },
      };
    },
    [setProducts],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return {
        success: {
          type: '',
          message: '상품이 삭제되었습니다.',
        },
      };
    },
    [setProducts],
  );

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    updateProductStock: () => {},
    addProductDiscount: () => {},
    removeProductDiscount: () => {},
  };
}
