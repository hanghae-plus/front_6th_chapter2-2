import { useCallback, useState } from 'react';

import { ProductWithUI, NotificationCallback } from '../../types';
import { initialProducts } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useProducts() {
  // useLocalStorage 훅 사용
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  // addProduct 함수
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>, onNotification?: NotificationCallback) => {
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
    (productId: string, updates: Partial<ProductWithUI>, onNotification?: NotificationCallback) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
      );
      onNotification?.('상품이 수정되었습니다.', 'success');
    },
    []
  );

  // deleteProduct 함수
  const deleteProduct = useCallback((productId: string, onNotification?: NotificationCallback) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    onNotification?.('상품이 삭제되었습니다.', 'success');
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
