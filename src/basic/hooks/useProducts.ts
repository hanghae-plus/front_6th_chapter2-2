// src/basic/hooks/useProducts.ts
import { useAtom } from 'jotai';
import { productsAtom, searchKeywordAtom } from '../store/atoms';
import { Product } from '../types';
import { useDebounce } from '../utils/hooks/useDebounce';

export const useProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const [searchKeyword, setSearchKeyword] = useAtom(searchKeywordAtom);
  
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()))
  );

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...newProduct, id: Date.now().toString(), discounts: newProduct.discounts || [] }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return {
    products: filteredProducts,
    addProduct,
    updateProduct,
    removeProduct,
    setSearchKeyword,
  };
};
