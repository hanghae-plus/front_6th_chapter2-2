import { useMemo } from 'react';
import { ProductWithUI } from '../../../../entities/product';
import { useDebounce } from '../../../../shared/hooks';

export function useProductSearch(
  products: ProductWithUI[],
  searchTerm: string
) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [products, debouncedSearchTerm]);

  return {
    debouncedSearchTerm,
    filteredProducts,
  };
}
