import { ProductWithUI } from "../types";

export function validateProduct(product: Partial<ProductWithUI>): {
  valid: boolean;
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
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
