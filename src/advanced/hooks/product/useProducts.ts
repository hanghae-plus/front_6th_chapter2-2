import { useCallback } from 'react';
import { ProductWithUI } from '../../../types';
import { useAtom } from 'jotai';
import { productsAtom } from '../../atoms/productsAtom';

export const useProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
    },
    [setProducts],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
      );
    },
    [setProducts],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    [setProducts],
  );

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
