import { useCallback } from 'react';

import type { ProductWithUI } from '../constants';
import { useProductStore } from './useProductStore';
import type { NotificationVariant } from '../../types';

interface useProductServiceProps {
  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function useProductService({ onAddNotification }: useProductServiceProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();

  const onAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      onAddNotification('상품이 추가되었습니다.', 'success');
    },
    [onAddNotification, addProduct]
  );

  const onUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      onAddNotification('상품이 수정되었습니다.', 'success');
    },
    [onAddNotification, updateProduct]
  );

  const onDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      onAddNotification('상품이 삭제되었습니다.', 'success');
    },
    [onAddNotification, deleteProduct]
  );

  return { products, onAddProduct, onUpdateProduct, onDeleteProduct };
}
