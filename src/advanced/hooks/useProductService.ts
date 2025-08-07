import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import type { ProductWithUI } from '../constants';
import { useProductStore } from './useProductStore';
import { addNotificationAtom } from '../entities/notification';

export function useProductService() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const addNotification = useSetAtom(addNotificationAtom);

  const onAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification, addProduct]
  );

  const onUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification, updateProduct]
  );

  const onDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification, deleteProduct]
  );

  return { products, onAddProduct, onUpdateProduct, onDeleteProduct };
}
