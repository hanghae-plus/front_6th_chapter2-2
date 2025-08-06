import { Product, CartItem, Coupon } from "../types";

// ================================ Cart ================================

export function validateCartStock(
  product: Product,
  requestedQuantity: number,
  cart: CartItem[]
) {
  // 1. 남은 재고 확인
  const remainingStock =
    product.stock -
    (cart.find((item) => item.product.id === product.id)?.quantity || 0);
  if (remainingStock <= 0) {
    return {
      isValid: false,
      errorMessage: "재고가 부족합니다!",
    };
  }

  // 2. 요청 수량이 총 재고를 넘는지 확인
  if (requestedQuantity > product.stock) {
    return {
      isValid: false,
      errorMessage: `재고는 ${product.stock}개까지만 있습니다.`,
    };
  }

  return { isValid: true, errorMessage: undefined };
}

// 쿠폰 사용 가능 여부 검증
export function validateCouponAvailable(
  coupon: Coupon,
  cartTotal: number
): { isValid: boolean; errorMessage?: string } {
  const MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON = 10000;

  if (
    coupon.discountType === "percentage" &&
    cartTotal < MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON
  ) {
    return {
      isValid: false,
      errorMessage: `percentage 쿠폰은 ${MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
    };
  }

  return { isValid: true, errorMessage: undefined };
}

// 쿠폰 코드 중복 검증
export function validateCouponCode(
  coupons: Coupon[],
  couponCode: string
): { isValid: boolean; errorMessage?: string } {
  const isDuplicate = coupons.some((c) => c.code === couponCode);

  if (isDuplicate) {
    return {
      isValid: false,
      errorMessage: "이미 존재하는 쿠폰 코드입니다.",
    };
  }

  return { isValid: true, errorMessage: undefined };
}

// ================================ Admin ================================

// Admin 가격 검증
export function validateAdminPrice(price: number): {
  isValid: boolean;
  errorMessage?: string;
} {
  if (price <= 0) {
    return {
      isValid: false,
      errorMessage: "가격은 0보다 커야 합니다",
    };
  }

  return { isValid: true, errorMessage: undefined };
}

// Admin 재고 검증 (비즈니스 규칙 포함)
export function validateAdminStock(stock: number): {
  isValid: boolean;
  errorMessage?: string;
} {
  const MAX_STOCK_QUANTITY = 10000; // 상수 import 대신 직접 정의

  if (stock < 0) {
    return {
      isValid: false,
      errorMessage: "재고는 0보다 커야 합니다",
    };
  }

  if (stock > MAX_STOCK_QUANTITY) {
    return {
      isValid: false,
      errorMessage: `재고는 ${MAX_STOCK_QUANTITY}개를 초과할 수 없습니다`,
    };
  }

  return { isValid: true, errorMessage: undefined };
}

// Admin 할인율 검증
export function validateDiscountRate(rate: number): {
  isValid: boolean;
  errorMessage?: string;
} {
  const MAX_DISCOUNT_RATE = 100;

  if (rate > MAX_DISCOUNT_RATE) {
    return {
      isValid: false,
      errorMessage: `할인율은 ${MAX_DISCOUNT_RATE}%를 초과할 수 없습니다`,
    };
  }

  return { isValid: true, errorMessage: undefined };
}

// Admin 할인 금액 검증
export function validateDiscountAmount(amount: number): {
  isValid: boolean;
  errorMessage?: string;
} {
  const MAX_COUPON_AMOUNT = 10000; // 상수 직접 정의

  if (amount > MAX_COUPON_AMOUNT) {
    return {
      isValid: false,
      errorMessage: `할인 금액은 ${MAX_COUPON_AMOUNT.toLocaleString()}원을 초과할 수 없습니다`,
    };
  }

  return { isValid: true, errorMessage: undefined };
}
