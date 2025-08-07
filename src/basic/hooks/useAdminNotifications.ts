import { useCallback } from 'react';
import { useProducts } from '../storeHooks/useProducts';
import { useCoupons } from '../storeHooks/useCoupons';
import { ProductWithUI } from '../datas/products';

export const useAdminNotifications = (
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void
) => {
  const { addProduct, updateProduct, deleteProduct } = useProducts();
  const { addCoupon, deleteCoupon } = useCoupons();

  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addProduct, addNotification]
  );

  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [updateProduct, addNotification]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [deleteProduct, addNotification]
  );

  const handleAddCoupon = useCallback(
    (newCoupon: any) => {
      addCoupon(newCoupon);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [addCoupon, addNotification]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [addNotification, deleteCoupon]
  );

  return {
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCoupon,
    handleDeleteCoupon
  };
};
