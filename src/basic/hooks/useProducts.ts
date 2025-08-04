// src/basic/hooks/useProducts.ts
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { INITIAL_PRODUCTS } from '../constants';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);

  const addProduct = (newProduct: Omit<Product, 'id' | 'discounts'>) => {
    setProducts(prevProducts => [
      ...prevProducts,
      {
        ...newProduct,
        id: `p${Date.now()}`,
        discounts: [] // 기본 할인 없음
      }
    ]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const removeProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  return { products, addProduct, updateProduct, removeProduct };
};
