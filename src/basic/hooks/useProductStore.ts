import { useCallback } from 'react';

import { type ProductWithUI } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useProductStore() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', []);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  return { products, addProduct, updateProduct, deleteProduct };
}
