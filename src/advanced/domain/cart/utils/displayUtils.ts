import { CartItem } from "../models";

/**
 * 아이템의 원래 가격(할인 전)을 계산하는 순수 함수
 */
export const calculateOriginalPrice = (item: CartItem): number => {
  return item.product.price * item.quantity;
};

/**
 * 아이템에 할인이 적용되었는지 확인하는 순수 함수
 */
export const hasItemDiscount = (item: CartItem, itemTotal: number): boolean => {
  const originalPrice = calculateOriginalPrice(item);
  return itemTotal < originalPrice;
};

/**
 * 아이템의 할인율을 계산하는 순수 함수
 */
export const calculateDiscountRate = (
  item: CartItem,
  itemTotal: number
): number => {
  const originalPrice = calculateOriginalPrice(item);
  const hasDiscount = hasItemDiscount(item, itemTotal);

  return hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;
};

/**
 * 카트 아이템의 표시 정보를 계산하는 종합 함수
 */
export const calculateItemDisplayInfo = (item: CartItem, itemTotal: number) => {
  const originalPrice = calculateOriginalPrice(item);
  const hasDiscount = hasItemDiscount(item, itemTotal);
  const discountRate = calculateDiscountRate(item, itemTotal);

  return {
    originalPrice,
    hasDiscount,
    discountRate,
    itemTotal,
  };
};
