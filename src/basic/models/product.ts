import { Product, Discount } from '../../types';

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

export const addProductDiscount = (
  products: Product[],
  productId: string,
  newDiscount: Discount,
): Product[] => {
  return products.map((p) => {
    if (p.id === productId) {
      const existingDiscountIndex = p.discounts.findIndex(
        (d) => d.quantity === newDiscount.quantity,
      );
      const newDiscounts = [...p.discounts];

      if (existingDiscountIndex > -1) {
        newDiscounts[existingDiscountIndex] = newDiscount;
      } else {
        newDiscounts.push(newDiscount);
      }
      newDiscounts.sort((a, b) => a.quantity - b.quantity);

      return { ...p, discounts: newDiscounts };
    }
    return p;
  });
};

export const removeProductDiscount = (
  products: Product[],
  productId: string,
  discountQuantity: number,
): Product[] => {
  return products.map((p) => {
    if (p.id === productId) {
      return {
        ...p,
        discounts: p.discounts.filter((d) => d.quantity !== discountQuantity),
      };
    }
    return p;
  });
};
