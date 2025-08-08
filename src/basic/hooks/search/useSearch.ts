import { ProductWithUI } from '../../../types';
import { useInput } from '../../../shared/hooks/useInput';
import { useDebounce } from '../../../shared/hooks/useDebounce';

const filteredProducts = (products: ProductWithUI[], debouncedSearchTerm: string) => {
  if (!debouncedSearchTerm) {
    return products;
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  );
};

export function useSearch(products: ProductWithUI[], debounceDelay: number = 500) {
  const {
    value: searchTerm,
    handleChange: handleSearchTermChange,
    reset: resetSearch,
  } = useInput('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  return {
    searchTerm,
    debouncedSearchTerm,
    filteredProducts: filteredProducts(products, debouncedSearchTerm),
    handleSearchTermChange,
    resetSearch,
    hasSearchResults: filteredProducts(products, debouncedSearchTerm).length > 0,
    isSearching: debouncedSearchTerm.length > 0,
  };
}
