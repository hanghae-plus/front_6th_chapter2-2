import { ProductWithUI } from '../types';

export const filterProducts = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm.trim()) return products;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerSearchTerm))
  );
};
