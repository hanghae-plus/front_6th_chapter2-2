import { ProductWithUI } from "../type/types";
import { formatPrice } from "./formatters";

/**
 * 상품의 표시 가격을 계산합니다 (순수 함수)
 * @param product 상품 정보
 * @param isAdmin 관리자 모드 여부
 * @param remainingStock 남은 재고 수량
 * @returns 표시할 가격 문자열
 */
export function getDisplayPrice(
  product: ProductWithUI,
  isAdmin: boolean,
  remainingStock: number
): string {
  // 재고가 없는 경우 "SOLD OUT" 표시
  if (remainingStock <= 0) {
    return "SOLD OUT";
  }

  // 관리자 모드에서는 가격을 원화 형식으로 표시하되, 통화 기호는 제외
  if (isAdmin) {
    return formatPrice(product.price, "KRW", false) + "원";
  }
  return formatPrice(product.price, "KRW", true);
}
