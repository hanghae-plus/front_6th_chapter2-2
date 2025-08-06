import { useCallback, useState } from 'react';

import { ProductWithUI } from '../../types';
import { initialProducts } from '../constants';

export function useProducts() {
  // localStorage에서 초기값 가져오기 (원본 패턴과 동일)
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  // addProduct 함수
  const addProduct = useCallback(
    (
      newProduct: Omit<ProductWithUI, 'id'>,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      onNotification?.('상품이 추가되었습니다.', 'success');
    },
    []
  );

  // updateProduct 함수
  const updateProduct = useCallback(
    (
      productId: string,
      updates: Partial<ProductWithUI>,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
      );
      onNotification?.('상품이 수정되었습니다.', 'success');
    },
    []
  );

  // deleteProduct 함수
  const deleteProduct = useCallback(
    (
      productId: string,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      onNotification?.('상품이 삭제되었습니다.', 'success');
    },
    []
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
