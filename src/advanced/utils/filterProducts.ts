// utils/productFilter.ts
import { Product } from '../../types';
import { ProductWithUI } from '../components/AppContainer';

export function filterProductsBySearchTerm(
  products: ProductWithUI[],
  searchTerm: string,
): Product[] {
  if (!searchTerm) return products;

  const lowered = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowered) ||
      (product.description && product.description.toLowerCase().includes(lowered)),
  );
}
