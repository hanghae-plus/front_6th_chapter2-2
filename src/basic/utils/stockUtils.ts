import { numberUtils } from "./numberUtils";

export const stockUtils = {
  /**
   * 재고 상태에 따른 텍스트 생성 (UI 표시용)
   */
  getStockStatusText(remainingStock: number, isLowStock: boolean): string {
    if (isLowStock) {
      return `품절임박! ${remainingStock}개 남음`;
    }
    if (remainingStock > 5) {
      return `재고 ${remainingStock}개`;
    }
    return "";
  },

  /**
   * 재고 유효성 검사 (모델에서 사용)
   */
  isValidStock(stock: number): boolean {
    return numberUtils.isNonNegative(stock) && stock <= 999999;
  },
};
