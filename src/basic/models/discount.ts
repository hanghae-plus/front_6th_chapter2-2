import { Product, Discount } from '../../types';

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
