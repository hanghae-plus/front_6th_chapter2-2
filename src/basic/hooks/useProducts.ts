// src/basic/hooks/useProducts.ts
import { useState, useMemo } from 'react';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { INITIAL_PRODUCTS } from '../constants';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchKeyword) {
      return products;
    }
    return products.filter(p => 
      p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [products, searchKeyword]);

  const addProduct = (newProduct: Omit<Product, 'id' | 'discounts' | 'description'>) => {
    setProducts(prevProducts => [
      ...prevProducts,
      {
        ...newProduct,
        id: `p${Date.now()}`,
        discounts: [], // 기본 할인 없음
        description: '새로운 상품입니다.' // 기본 설명
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