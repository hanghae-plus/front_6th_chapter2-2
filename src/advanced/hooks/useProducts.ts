import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { addNotificationAtom } from '../atoms/notificationAtoms';
import {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
} from '../atoms/productAtoms';
import { ProductForm } from '../types';

const useProducts = () => {
  const [products] = useAtom(productsAtom);
  const addProductAction = useSetAtom(addProductAtom);
  const updateProductAction = useSetAtom(updateProductAtom);
  const deleteProductAction = useSetAtom(deleteProductAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const addProduct = useCallback(
    (productForm: ProductForm) => {
      addProductAction(productForm);
      addNotification({ message: '상품이 추가되었습니다.', type: 'success' });
    },
    [addProductAction, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, productForm: ProductForm) => {
      updateProductAction({ id: productId, productForm });
      addNotification({ message: '상품이 수정되었습니다.', type: 'success' });
    },
    [updateProductAction, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      deleteProductAction(productId);
      addNotification({ message: '상품이 삭제되었습니다.', type: 'success' });
    },
    [deleteProductAction, addNotification],
  );

  return { products, addProduct, updateProduct, deleteProduct };
};

export { useProducts };
