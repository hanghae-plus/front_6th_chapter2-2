// src/basic/hooks/useProducts.ts
import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { INITIAL_PRODUCTS } from '../constants';
import { Product } from '../types';
import { useDebounce } from '../utils/hooks/useDebounce';

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchKeyword) {
      return products;
    }
    return products.filter(p => 
      p.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()))
    );
  }, [products, debouncedSearchKeyword]);

  const addProduct = (newProduct: Omit<Product, 'id' | 'discounts'>) => {
    setProducts(prevProducts => [
      ...prevProducts,
      {
        ...newProduct,
        id: `p${Date.now()}`,
        discounts: [], // 기본 할인 없음
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

  return { 
    products: filteredProducts, 
    addProduct, 
    updateProduct, 
    removeProduct,
    setSearchKeyword 
  };
};