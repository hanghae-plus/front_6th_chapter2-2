import { Product } from '../../types';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

/**
 * 상품을 검색어로 필터링합니다.
 * @param products 상품 배열
 * @param searchTerm 검색어
 * @returns 필터링된 상품 배열
 */
export const filterProducts = (products: ProductWithUI[], searchTerm: string): ProductWithUI[] => {
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

