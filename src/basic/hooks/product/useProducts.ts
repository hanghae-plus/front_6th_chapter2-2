import { useCallback, useState } from 'react';
import { initialProducts } from '../../data/mockProducts';
import { ProductWithUI } from '../../../types';
import { useNotifications } from '../notifications/useNotifications';

export const useProducts = () => {

  const { addNotification } = useNotifications()

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


  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification],
  );


  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification],
  );


  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification],
  );

  return {
    products, 
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}