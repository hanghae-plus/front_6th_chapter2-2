import { useAtom } from 'jotai';

import { ProductWithUI, NotificationCallback } from '../../types';
import { addProductAtom, updateProductAtom, deleteProductAtom } from '../store/actions';

export function useProducts() {
  const [, addProductAction] = useAtom(addProductAtom);
  const [, updateProductAction] = useAtom(updateProductAtom);
  const [, deleteProductAction] = useAtom(deleteProductAtom);

  const addProduct = (
    newProduct: Omit<ProductWithUI, 'id'>,
    onNotification?: NotificationCallback
  ) => {
    addProductAction({
      newProduct,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>,
    onNotification?: NotificationCallback
  ) => {
    updateProductAction({
      productId,
      updates,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const deleteProduct = (productId: string, onNotification?: NotificationCallback) => {
    deleteProductAction({
      productId,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
