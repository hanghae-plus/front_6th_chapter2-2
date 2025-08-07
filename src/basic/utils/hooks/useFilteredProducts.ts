import { useMemo } from "react";
import { ProductWithUI } from "../../../types";

export const useFilteredProducts = (
  products: Array<ProductWithUI>,
  searchTerm: string
): Array<ProductWithUI> => {
  return useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const term = searchTerm.toLowerCase();

    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(term);
      const descriptionMatch = product.description
        ?.toLowerCase()
        .includes(term);

      return nameMatch || descriptionMatch;
    });
  }, [products, searchTerm]);
};
