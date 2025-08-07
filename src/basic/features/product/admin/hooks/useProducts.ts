import { useCallback } from 'react';
import { ProductWithUI } from '../../../../entities/product';

interface UseProductsProps {
  products: ProductWithUI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}

export function useProducts({
  products,
  setProducts,
  addNotification,
}: UseProductsProps) {
  // 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  // 상품 업데이트
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
