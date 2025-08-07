import { numberUtils } from "./numberUtils";

export const priceUtils = {
  /**
   * 가격 포맷팅 (원화)
   */
  formatCurrency(amount: number, showSymbol: boolean = true): string {
    const formatted = amount.toLocaleString();
    return showSymbol ? `₩${formatted}` : `${formatted}원`;
  },

  /**
   * 유효한 가격 범위 확인
   */
  isValidPrice(price: number): boolean {
    return numberUtils.isNonNegative(price) && price <= 999999999;
  },

  /**
   * 유효한 수량 범위 확인
   */
  isValidQuantity(quantity: number): boolean {
    return numberUtils.isPositive(quantity) && quantity <= 99;
  },
};
