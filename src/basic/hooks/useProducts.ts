// src/basic/hooks/useProducts.ts
import { useAtom } from 'jotai';
import { productsAtom, searchKeywordAtom, filteredProductsAtom } from '../store/atoms';
import { Product } from '../types';
import { useDebounce } from '../utils/hooks/useDebounce';
import { useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const [searchKeyword, setSearchKeyword] = useAtom(searchKeywordAtom);
  
  // 디바운스 로직은 훅 내부에 유지하여 UI 입력과 상태 업데이트를 조절합니다.
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  // 파생 atom을 직접 사용하는 대신, 디바운스된 키워드를 사용하여 필터링 로직을 훅 내에서 관리할 수도 있습니다.
  // 하지만 여기서는 파생 atom의 강력함을 보여주기 위해, 디바운스된 값을 searchKeywordAtom에 다시 반영하는 방식을 사용하지 않고,
  // 검색 입력 자체를 Jotai atom으로 관리하여 즉각적인 UI 반응성을 유지하면서,
  // 실제 필터링은 파생 atom에서 처리하도록 합니다.
  // `filteredProductsAtom`을 수정하여 디바운스를 적용하는 것이 더 고급 패턴이지만,
  // 현재 구조에서는 `useDebounce`를 그대로 활용하는 것이 간단합니다.
  // `filteredProductsAtom`을 디바운스된 값으로 필터링하도록 수정하겠습니다.

  const [allProducts] = useAtom(productsAtom);
  const [keyword, setKeyword] = useAtom(searchKeywordAtom);
  const debouncedKeyword = useDebounce(keyword, 500);

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(debouncedKeyword.toLowerCase()))
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
    setSearchKeyword: setKeyword,
  };
};
