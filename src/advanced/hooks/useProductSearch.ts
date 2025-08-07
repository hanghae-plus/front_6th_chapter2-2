import { useMemo } from "react";
import { ProductWithUI } from "../types/product";

interface UseProductFilterProps {
  products: ProductWithUI[];
  searchTerm: string;
}

export const useProductSearch = ({ products, searchTerm }: UseProductFilterProps) => {
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const searchValue = searchTerm.toLowerCase();

    return products.filter((product) => {
      // 상품명에 검색어가 포함되어 있는지 확인
      const nameMatch = product.name.toLowerCase().includes(searchValue);
      // 상품 설명에 검색어가 포함되어 있는지 확인 (설명이 없을 수 있음)
      const descriptionMatch = product.description?.toLowerCase().includes(searchValue);

      return nameMatch || descriptionMatch;
    });
  }, [products, searchTerm]);

  return filteredProducts;
};
