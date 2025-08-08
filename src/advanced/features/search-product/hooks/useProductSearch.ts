import { ProductWithUI } from "@entities/product";
import { useSearch } from "@shared";

export function useProductSearch(products: ProductWithUI[]) {
  const search = useSearch();

  const filteredProducts = search.debouncedValue
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search.debouncedValue.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(search.debouncedValue.toLowerCase()))
      )
    : products;

  return {
    filteredProducts,
    searchValue: search.value,
    searchTerm: search.debouncedValue,
    onSearchChange: search.change,
  };
}
