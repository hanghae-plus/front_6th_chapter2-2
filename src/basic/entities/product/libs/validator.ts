import { ProductWithUI } from "@entities/product";

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  correctedValue?: number;
}

/**
 * 가격 유효성 검사
 */
export const validatePrice = (value: string | number): ValidationResult => {
  const numValue = typeof value === "string" ? parseInt(value) : value;

  if (isNaN(numValue) || numValue < 0) {
    return {
      isValid: false,
      errorMessage: "가격은 0보다 커야 합니다",
      correctedValue: 0,
    };
  }

  return { isValid: true };
};

/**
 * 재고 유효성 검사
 */
export const validateStock = (value: string | number): ValidationResult => {
  const numValue = typeof value === "string" ? parseInt(value) : value;

  if (isNaN(numValue) || numValue < 0) {
    return {
      isValid: false,
      errorMessage: "재고는 0 이상이어야 합니다",
      correctedValue: 0,
    };
  }

  if (numValue > 9999) {
    return {
      isValid: false,
      errorMessage: "재고는 9999개를 초과할 수 없습니다",
      correctedValue: 9999,
    };
  }

  return { isValid: true };
};

/**
 * 상품명 유효성 검사
 */
export const validateProductName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: "상품명은 필수입니다",
    };
  }

  return { isValid: true };
};

/**
 * 전체 상품 유효성 검사
 */
export function validateProduct(product: Partial<ProductWithUI>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const nameValidation = validateProductName(product.name || "");
  if (!nameValidation.isValid && nameValidation.errorMessage) {
    errors.name = nameValidation.errorMessage;
  }

  const priceValidation = validatePrice(product.price || 0);
  if (!priceValidation.isValid && priceValidation.errorMessage) {
    errors.price = priceValidation.errorMessage;
  }

  const stockValidation = validateStock(product.stock ?? 0);
  if (!stockValidation.isValid && stockValidation.errorMessage) {
    errors.stock = stockValidation.errorMessage;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
