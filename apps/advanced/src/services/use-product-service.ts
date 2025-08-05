import { CartItem } from '@/models/cart';
import { ProductView } from '@/models/product';
import { useProductStore } from '@/store';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useProductService = () => {
  const productStore = useProductStore();

  const formatPrice = useCallback(
    (price: number, productId: string, cart: CartItem[]): string => {
      const product = productStore.findProductById(productId);
      if (!product) return `₩${price.toLocaleString()}`;

      const remainingStock =
        product.stock -
        (cart.find(item => item.product.id === productId)?.quantity || 0);

      if (remainingStock <= 0) {
        return 'SOLD OUT';
      }

      return `${price.toLocaleString()}원`;
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

  const addProduct = useCallback(
    (product: Omit<ProductView, 'id'>) => {
      productStore.addProduct({ ...product, id: uuidv4() });
    },
    [productStore]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductView>) => {
      productStore.updateProduct(productId, updates);
    },
    [productStore]
  );

  const getProducts = useCallback(() => {
    return productStore.products;
  }, [productStore.products]);

  return {
    // state
    getProducts: getProducts,
    findProductById: productStore.findProductById,

    // actions
    formatPrice,
    filterProducts,
    updateProduct,
    addProduct,
    removeProductById: productStore.removeProductById
  };
};
