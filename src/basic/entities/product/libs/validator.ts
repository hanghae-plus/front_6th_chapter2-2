import { Product } from "../types";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export function validateProduct(product: Partial<ProductWithUI>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!product.name?.trim()) {
    errors.name = "상품명은 필수입니다";
  }

  if (!product.price || product.price <= 0) {
    errors.price = "가격은 0보다 커야 합니다";
  }

  if (product.stock === undefined || product.stock < 0) {
    errors.stock = "재고는 0 이상이어야 합니다";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
