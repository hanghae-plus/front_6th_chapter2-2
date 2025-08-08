import { ProductWithUI } from "../../types";
import {
  safeParseNumber,
  safeParseInt,
  isValidPrice,
  isValidStock,
  isValidProductName,
} from "../utils/validators";
import {
  PRODUCT_CONSTRAINTS,
  PRODUCT_DISPLAY,
  STOCK_STATUS_STYLES,
  PRODUCT_ERROR_MESSAGES,
} from "../constants/product";

/**
 * 가격 입력 처리 (AdminPage onChange에서 사용)
 */
export function handlePriceInput(value: string): {
  price: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (value === "") {
    return { price: 0, isValid: true };
  }

  if (!/^\d+$/.test(value)) {
    return {
      price: 0,
      isValid: false,
      errorMessage: PRODUCT_ERROR_MESSAGES.ONLY_NUMBERS,
    };
  }

  const price = safeParseNumber(value);

  if (!isValidPrice(price)) {
    return {
      price: 0,
      isValid: false,
      errorMessage: PRODUCT_ERROR_MESSAGES.PRICE_REQUIRED,
    };
  }

  return { price, isValid: true };
}

/**
 * 재고 입력 처리 (AdminPage onChange에서 사용)
 */
export function handleStockInput(value: string): {
  stock: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (value === "") {
    return { stock: 0, isValid: true };
  }

  // 숫자만 허용
  if (!/^\d+$/.test(value)) {
    return {
      stock: 0,
      isValid: false,
      errorMessage: PRODUCT_ERROR_MESSAGES.ONLY_NUMBERS,
    };
  }

  const stock = safeParseInt(value);

  if (!isValidStock(stock)) {
    return {
      stock: 0,
      isValid: false,
      errorMessage: PRODUCT_ERROR_MESSAGES.STOCK_REQUIRED,
    };
  }

  if (stock > PRODUCT_CONSTRAINTS.MAX_STOCK) {
    return {
      stock: PRODUCT_CONSTRAINTS.MAX_STOCK,
      isValid: false,
      errorMessage: PRODUCT_ERROR_MESSAGES.STOCK_OVER_MAX,
    };
  }

  return { stock, isValid: true };
}

/**
 * 가격 검증 (AdminPage onBlur에서 사용)
 */
export function validatePrice(value: string): {
  isValid: boolean;
  correctedPrice: number;
  errorMessage?: string;
} {
  const price = safeParseNumber(value);

  if (!isValidPrice(price)) {
    return {
      isValid: false,
      correctedPrice: 0,
      errorMessage: PRODUCT_ERROR_MESSAGES.PRICE_INVALID,
    };
  }
  return { isValid: true, correctedPrice: price };
}

/**
 * 재고 검증 (AdminPage onBlur에서 사용)
 */
export function validateStock(value: string): {
  isValid: boolean;
  correctedStock: number;
  errorMessage?: string;
} {
  const stock = safeParseInt(value);

  if (!isValidStock(stock)) {
    return {
      isValid: false,
      correctedStock: 0,
      errorMessage: PRODUCT_ERROR_MESSAGES.STOCK_REQUIRED,
    };
  }

  if (stock > PRODUCT_CONSTRAINTS.MAX_STOCK) {
    return {
      isValid: false,
      correctedStock: PRODUCT_CONSTRAINTS.MAX_STOCK,
      errorMessage: PRODUCT_ERROR_MESSAGES.STOCK_OVER_MAX,
    };
  }

  return { isValid: true, correctedStock: stock };
}

/**
 * 상품 폼 전체 검증
 */
export function validateProductForm(formData: {
  name: string;
  price: number;
  stock: number;
  description: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!isValidProductName(formData.name)) {
    if (!formData.name.trim()) {
      errors.push(PRODUCT_ERROR_MESSAGES.NAME_REQUIRED);
    }
  }

  if (!isValidPrice(formData.price)) {
    errors.push(PRODUCT_ERROR_MESSAGES.PRICE_REQUIRED);
  }

  if (!isValidStock(formData.stock)) {
    errors.push(PRODUCT_ERROR_MESSAGES.STOCK_REQUIRED);
  }

  if (formData.stock > PRODUCT_CONSTRAINTS.MAX_STOCK) {
    errors.push(PRODUCT_ERROR_MESSAGES.STOCK_OVER_MAX);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 재고 상태 표시용 클래스 계산
 */
export function getStockStatusClass(stock: number): string {
  if (stock > PRODUCT_DISPLAY.NORMAL_STOCK_THRESHOLD) {
    return STOCK_STATUS_STYLES.NORMAL;
  } else if (stock > PRODUCT_DISPLAY.CRITICAL_STOCK_THRESHOLD) {
    return STOCK_STATUS_STYLES.LOW;
  } else {
    return STOCK_STATUS_STYLES.OUT_OF_STOCK;
  }
}

/**
 * 상품 배지 정보
 */
export function getProductBadgeInfo(product: ProductWithUI) {
  return {
    showRecommended: product.isRecommended,
    recommendedText: PRODUCT_DISPLAY.RECOMMENDED_BADGE_TEXT,
    recommendedStyle: PRODUCT_DISPLAY.RECOMMENDED_BADGE_STYLE,

    showDiscount: product.discounts.length > 0,
    discountStyle: PRODUCT_DISPLAY.DISCOUNT_BADGE_STYLE,
  };
}

/**
 * 최대 할인율 반환
 */
export function getMaxDiscountRate(product: ProductWithUI): number {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map((d) => d.rate)) * 100;
}

/**
 * 재고 표시 정보 반환
 */
export function getStockDisplayInfo(remainingStock: number) {
  const isOutOfStock =
    remainingStock <= PRODUCT_DISPLAY.CRITICAL_STOCK_THRESHOLD;
  const isLowStock =
    remainingStock <= PRODUCT_DISPLAY.LOW_STOCK_THRESHOLD && remainingStock > 0;

  if (isOutOfStock) {
    return {
      shouldShow: false,
      isOutOfStock: true,
      message: "",
      textColor: "",
    };
  }

  if (isLowStock) {
    return {
      shouldShow: true,
      isOutOfStock: false,
      message: `품절임박! ${remainingStock}개 남음`,
      textColor: "text-red-600",
    };
  }

  return {
    shouldShow: true,
    isOutOfStock: false,
    message: `재고 ${remainingStock}개`,
    textColor: "text-gray-500",
  };
}

/**
 * 할인 정보 표시 여부 확인
 */
export function shouldShowDiscountInfo(product: ProductWithUI): boolean {
  return product.discounts.length > 0;
}

/**
 * 할인 정보 텍스트 생성
 */
export function getDiscountDisplayText(discount: {
  quantity: number;
  rate: number;
}): string {
  return `${discount.quantity}개 이상 구매시 할인 ${discount.rate * 100}%`;
}

/**
 * 가격 포맷팅 (기존 함수 활용)
 */
export function formatProductPrice(
  price: number,
  productId: string,
  formatPriceFunction: (price: number, productId?: string) => string
): string {
  return formatPriceFunction(price, productId);
}
