import { useAppState } from './useAppState';
import { useNotification } from './useNotification';
import { Product } from '../types';

export const useProducts = (
  appState: ReturnType<typeof useAppState>,
  notificationActions: ReturnType<typeof useNotification>
) => {
  const { products, setProducts } = appState;
  const { addNotification } = notificationActions;

  // 상품 추가
  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [
      ...prev,
      {
        ...product,
        id: `p${Date.now()}`,
      },
    ]);
    addNotification('상품이 추가되었습니다.', 'success');
  };

  // 상품 수정
  const updateProduct = (updateProduct: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === updateProduct.id
          ? { ...product, ...updateProduct }
          : product
      )
    );
    addNotification('상품이 수정되었습니다.', 'success');
  };

  // 상품 삭제
  const deleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  // 상품 조회
  const getProduct = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  return {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    getProduct,
  };
};
