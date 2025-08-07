import { CartItem, ProductWithUI } from '../types';
import { getRemainingStock } from './calculators';

/**
 * 검증 결과 인터페이스
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
  correctedValue?: number;
}

/**
 * 가격 검증 (productService)
 */
export const validatePrice = (value: string): ValidationResult => {
  if (value === '') {
    return { isValid: true, message: '', correctedValue: 0 };
  }

  const price = parseInt(value);
  if (isNaN(price)) {
    return {
      isValid: false,
      message: '숫자만 입력',
      correctedValue: 0,
    };
  }

  if (price <= 0) {
    return {
      isValid: false,
      message: '가격은 0보다 커야 합니다.',
      correctedValue: 0,
    };
  }
  return { isValid: true, message: '', correctedValue: price };
};

/**
 * 재고 검증 (productService)
 */
export const validateStock = (value: string): ValidationResult => {
  if (value === '') {
    return { isValid: true, message: '', correctedValue: 0 };
  }

  const stock = parseInt(value);
  if (isNaN(stock)) {
    return {
      isValid: false,
      message: '숫자만 입력',
      correctedValue: 0,
    };
  }

  if (stock <= 0) {
    return {
      isValid: false,
      message: '재고는 0보다 커야 합니다',
      correctedValue: 0,
    };
  }
  if (stock > 9999) {
    return {
      isValid: false,
      message: '재고는 9999개를 초과할 수 없습니다',
      correctedValue: 9999,
    };
  }
  return { isValid: true, message: '', correctedValue: stock };
};

export const validateCartOperation = {
  // 재고 부족 검증
  validateStockAvailability: (product: ProductWithUI, cart: CartItem[]) => {
    const remainingStock = getRemainingStock(product, cart);
    return {
      isValid: remainingStock > 0,
      message: '재고가 부족합니다!',
      remainingStock,
    };
  },

  // 수량 증가 가능 검증
  validateQuantityIncrease: (
    product: ProductWithUI,
    currentQuantity: number
  ) => {
    const newQuantity = currentQuantity + 1;
    return {
      isValid: newQuantity <= product.stock,
      message: `재고는 ${product.stock}개까지만 있습니다.`,
      newQuantity,
    };
  },

  // 수량 변경 검증
  validateQuantityChange: (product: ProductWithUI, newQuantity: number) => {
    if (newQuantity <= 0) {
      return {
        isValid: false,
        message: '수량은 1개 이상이어야 합니다.',
        action: 'remove',
      };
    }

    if (newQuantity > product.stock) {
      return {
        isValid: false,
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        action: 'limit',
      };
    }

    return {
      isValid: true,
      message: '',
      action: 'update',
    };
  },
};
