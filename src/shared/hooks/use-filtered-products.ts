import { useMemo, useState } from 'react';
import { useDebounceValue } from './use-debounce-value';
import { ProductModel } from '@/shared/models';
import type { ProductWithUI } from '@/shared/constants';

export function useFilteredProducts(products: ProductWithUI[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    const productModel = new ProductModel(products);
    return productModel.filter(debouncedSearchTerm);
  }, [products, debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, debouncedSearchTerm, filteredProducts };
}
