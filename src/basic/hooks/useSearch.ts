import { useEffect, useMemo, useState } from "react";
import { ProductWithUI } from "./useProducts";

export const useSearch = (searchTerm: string, products: ProductWithUI[]) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const filteredProduct = useMemo(
    () =>
      debouncedSearchTerm
        ? products.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()))
          )
        : products,
    [products, debouncedSearchTerm]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { debouncedSearchTerm, searchResult: filteredProduct };
};
