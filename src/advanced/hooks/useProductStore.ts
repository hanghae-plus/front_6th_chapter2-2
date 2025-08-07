import { useCallback } from 'react';

import { type ProductWithUI, initialProducts } from '../constants';
import { useLocalStorage } from '../shared/hooks';

export function useProductStore() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

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
