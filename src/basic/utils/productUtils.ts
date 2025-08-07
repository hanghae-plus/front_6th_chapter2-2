import { ProductWithUI } from "../App";
import { stockUtils } from "./stockUtils";
import { numberUtils } from "./numberUtils";

/**
 * 재고 상태에 따른 텍스트 반환 (UI 표시용)
 */
export function getStockStatusText(
  remainingStock: number,
  isLowStock: boolean
): string {
  return stockUtils.getStockStatusText(remainingStock, isLowStock);
}

/**
 * 상품의 최대 할인율을 퍼센트로 변환 (UI 표시용)
 */
export function getMaxDiscountPercentage(product: ProductWithUI): number {
  if (product.discounts.length === 0) return 0;
  const maxRate = numberUtils.findMax(product.discounts.map((d) => d.rate));
  return Math.round(maxRate * 100);
}

/**
 * 상품의 버튼 텍스트 반환
 */
export function getProductButtonText(isOutOfStock: boolean): string {
  return isOutOfStock ? "품절" : "장바구니 담기";
}

/**
 * 상품의 버튼 variant 반환
 */
export function getProductButtonVariant(
  isOutOfStock: boolean
): "ghost" | "black" {
  return isOutOfStock ? "ghost" : "black";
}
