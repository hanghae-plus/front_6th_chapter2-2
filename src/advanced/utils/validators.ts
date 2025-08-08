import { Product } from "../types";

export const validateProductForm = (form: Omit<Product, 'id'>): string[] => {
  const errors: string[] = [];
  if (!form.name.trim()) errors.push('상품명은 필수입니다');
  if (form.price <= 0) errors.push('가격은 0보다 커야 합니다');
  if (form.stock < 0) errors.push('재고는 0 이상이어야 합니다');
  return errors;
};
