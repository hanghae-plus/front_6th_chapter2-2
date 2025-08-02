import { ProductView } from '@/models/product';
import { useProductStore } from '@/store';
import { useCallback } from 'react';

export const useProductService = () => {
  const productStore = useProductStore();

  const formatPrice = useCallback(
    (price: number, productId: string, cart: any[]): string => {
      const product = productStore.findProductById(productId);
      if (!product) return `₩${price.toLocaleString()}`;

      const remainingStock =
        product.stock -
        (cart.find(item => item.product.id === productId)?.quantity || 0);

      if (remainingStock <= 0) {
        return 'SOLD OUT';
      }

      return `₩${price.toLocaleString()}`;
    },
    [productStore]
  );

  const filterProducts = useCallback(
    (products: ProductView[], searchTerm: string): ProductView[] => {
      if (!searchTerm) return products;

      const lowercaseSearchTerm = searchTerm.toLowerCase();
      return products.filter(product => {
        const lowercaseName = product.name.toLowerCase();
        const lowercaseDescription = (product.description ?? '').toLowerCase();

        return (
          lowercaseName.includes(lowercaseSearchTerm) ||
          lowercaseDescription.includes(lowercaseSearchTerm)
        );
      });
    },
    []
  );

  return {
    formatPrice,
    filterProducts,
    products: productStore.products,
    findProductById: productStore.findProductById,
  };
};
