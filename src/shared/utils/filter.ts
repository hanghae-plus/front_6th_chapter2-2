import { ProductWithUI } from '../constants/mocks';

export const filterProducts = (products: ProductWithUI[], searchTerm: string): ProductWithUI[] => {
  if (!searchTerm) {
    return products;
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};
