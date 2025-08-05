import { DISCOUNT, STOCK } from "../constants/business";
import { MESSAGES } from "../constants/messages";

export const validator = {
  /**
   * 문자열 전체가 숫자인지 확인
   */
  validateNumericString: (value: string): string | null => {
    if (value === "") return "";
    if (/^\d+$/.test(value)) return value;

    return null;
  },

  /**
   * 재고 수량 검증 (0 ~ 9999)
   */
  isValidStock: (
    stock: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (stock <= 0)
      return {
        isValid: false,
        message: MESSAGES.STOCK.MIN,
        correctedValue: 0,
      };
    if (stock > STOCK.MAX_QUANTITY)
      return {
        isValid: false,
        message: MESSAGES.STOCK.MAX,
        correctedValue: STOCK.MAX_QUANTITY,
      };

    return { isValid: true, message: "", correctedValue: stock };
  },

  /**
   * 가격 검증 (0 이상)
   */
  isValidPrice: (
    price: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (price <= 0)
      return {
        isValid: false,
        message: MESSAGES.PRICE.MIN,
        correctedValue: 0,
      };

    return { isValid: true, message: "", correctedValue: price };
  },

  /**
   * 쿠폰 할인율 검증 (0 ~ 100)
   */
  isValidDiscountPercentage: (
    value: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (value < 0)
      return {
        isValid: false,
        message: MESSAGES.DISCOUNT_PERCENTAGE.MIN,
        correctedValue: 0,
      };
    if (value > DISCOUNT.MAX_PERCENTAGE)
      return {
        isValid: false,
        message: MESSAGES.DISCOUNT_PERCENTAGE.MAX,
        correctedValue: DISCOUNT.MAX_PERCENTAGE,
      };
    return { isValid: true, message: "", correctedValue: value };
  },

  /**
   * 쿠폰 할인 금액 검증 (0 ~ 100000)
   */
  isValidDiscountAmount: (
    value: number
  ): { isValid: boolean; message: string; correctedValue: number } => {
    if (value < 0)
      return {
        isValid: false,
        message: MESSAGES.DISCOUNT_AMOUNT.MIN,
        correctedValue: 0,
      };
    if (value > DISCOUNT.MAX_COUPON_AMOUNT)
      return {
        isValid: false,
        message: MESSAGES.DISCOUNT_AMOUNT.MAX,
        correctedValue: DISCOUNT.MAX_COUPON_AMOUNT,
      };
    return { isValid: true, message: "", correctedValue: value };
  },
};
