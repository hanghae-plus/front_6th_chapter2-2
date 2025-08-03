import { Product, CartItem, Coupon } from "../types";

// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// TODO: 구현

export function validateCartStock(product: Product, requestedQuantity: number, cart: CartItem[]) {
  // 1. 남은 재고 확인
  const remainingStock = product.stock - (cart.find(item => item.product.id === product.id)?.quantity || 0);
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
