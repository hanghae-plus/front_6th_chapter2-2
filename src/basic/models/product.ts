import { Product } from '../../types';

export const addProduct = (products: Product[], newProduct: Omit<Product, 'id'>): Product[] => {
  const productWithId: Product = {
    ...newProduct,
    id: `p${Date.now()}`,
  };
  return [...products, productWithId];
};

export const updateProduct = (
  products: Product[],
  productId: string,
  updates: Partial<Product>,
): Product[] => {
  return products.map((p) => (p.id === productId ? { ...p, ...updates } : p));
};

export const deleteProduct = (products: Product[], productId: string): Product[] => {
  return products.filter((p) => p.id !== productId);
};

export const updateProductStock = (
  products: Product[],
  productId: string,
  newStock: number,
): Product[] => {
  return products.map((p) => (p.id === productId ? { ...p, stock: newStock } : p));
};
