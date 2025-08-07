import { useMemo } from "react";
import { ProductWithUI } from "../types";
import { useDebounce } from "./useDebounce";

export function useFilteredProducts(
  products: ProductWithUI[],
  searchTerm: string
) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;

    const lowercased = debouncedSearchTerm.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercased) ||
        product.description?.toLowerCase().includes(lowercased)
    );
  }, [products, debouncedSearchTerm]);

  return { filteredProducts, debouncedSearchTerm };
}
