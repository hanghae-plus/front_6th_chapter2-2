import { Product } from "../../types";

// 상품 검색 및 필터링
export const filterSearchTermByProduct = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
  );
};
