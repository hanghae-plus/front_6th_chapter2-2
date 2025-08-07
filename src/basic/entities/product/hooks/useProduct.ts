import { useCallback, Dispatch, SetStateAction } from 'react';
import { ProductWithUI } from '../types/product';

interface UseProductPropsType {
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  addNotification: (message: string, type: 'success' | 'error') => void;
}

export const useProduct = ({ setProducts, addNotification }: UseProductPropsType) => {
  // 상품 추가 (관리자 기능)
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification(`${newProduct.name} 상품이 추가되었습니다.`, 'success');
      return product;
    },
    [setProducts, addNotification]
  );

  // 상품 수정 (관리자 기능)
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
      );
      addNotification(`${updates.name} 상품이 수정되었습니다.`, 'success');
    },
    [setProducts, addNotification]
  );

  // 상품 삭제 (관리자 기능)
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification(`${productId} 상품이 삭제되었습니다.`, 'success');
    },
    [setProducts, addNotification]
  );

  return {
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
