import { ProductWithUI } from '../../../types';

export const filteredProducts = (products: ProductWithUI[], searchQuery: string) => {
  if (!searchQuery) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
};
