import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Products } from '../constants/products';
import { useNotification } from './useNotification';
import { productsAtom } from '../store/atoms';

export function useProducts() {
  const [products, setProducts] = useAtom(productsAtom);
  const { addNotification } = useNotification();

  const updateProduct = useCallback(
    (productId: string, updates: Partial<(typeof Products)[number]>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
      );
    },
    [addNotification],
  );

  const addProduct = useCallback(
    (newProduct: Omit<(typeof Products)[number], 'id'>) => {
      const product: (typeof Products)[number] = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
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
    updateProduct,
    addProduct,
    deleteProduct,
  };
}
