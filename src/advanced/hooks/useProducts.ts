import { useAtom } from 'jotai';

import { ProductWithUI, NotificationCallback } from '../../types';
import { productsAtom } from '../store/atoms';
import { addProductAtom, updateProductAtom, deleteProductAtom } from '../store/actions';

export function useProducts() {
  const [products, setProducts] = useAtom(productsAtom);

  // Jotai action atoms 사용
  const [, addProductAction] = useAtom(addProductAtom);
  const [, updateProductAction] = useAtom(updateProductAtom);
  const [, deleteProductAction] = useAtom(deleteProductAtom);

  // 기존 인터페이스 유지를 위한 래퍼 함수들
  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>, onNotification?: NotificationCallback) => {
    addProductAction({ 
      newProduct, 
      onNotification: onNotification as ((message: string, type?: 'success' | 'error' | 'warning') => void) | undefined 
    });
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>, onNotification?: NotificationCallback) => {
    updateProductAction({ 
      productId, 
      updates, 
      onNotification: onNotification as ((message: string, type?: 'success' | 'error' | 'warning') => void) | undefined 
    });
  };

  const deleteProduct = (productId: string, onNotification?: NotificationCallback) => {
    deleteProductAction({ 
      productId, 
      onNotification: onNotification as ((message: string, type?: 'success' | 'error' | 'warning') => void) | undefined 
    });
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
