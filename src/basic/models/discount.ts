import { CartItem } from "../../types";

// 개별 상품의 수량 할인율 계산
export const getQuantityDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);
};

// 장바구니에 대량 구매가 있는지 확인 (10개 이상)
export const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some((cartItem) => cartItem.quantity >= 10);
};

// 대량 구매 추가 할인 보너스 계산
export const getBulkDiscountBonus = (cart: CartItem[]): number => {
  return hasBulkPurchase(cart) ? 0.05 : 0;
};

// 적용 가능한 최대 할인율 계산
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const baseDiscount = getQuantityDiscount(item);
  const bulkBonus = getBulkDiscountBonus(cart);
  return Math.min(baseDiscount + bulkBonus, 0.5); // 최대 50% 할인
};

// 할인이 적용된 아이템 총액 계산
export const calculateItemTotalWithDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  return Math.round(price * quantity * (1 - discount));
};

// 할인 정보 상세 반환
export const getDiscountInfo = (
  item: CartItem,
  cart: CartItem[]
): {
  baseDiscountRate: number;
  bulkDiscountBonus: number;
  totalDiscountRate: number;
  hasBulkPurchase: boolean;
} => {
  const baseDiscountRate = getQuantityDiscount(item);
  const bulkDiscountBonus = getBulkDiscountBonus(cart);
  const totalDiscountRate = getMaxApplicableDiscount(item, cart);
  const bulkPurchase = hasBulkPurchase(cart);

  return {
    baseDiscountRate,
    bulkDiscountBonus,
    totalDiscountRate,
    hasBulkPurchase: bulkPurchase,
  };
};

// 아이템별 할인 정보 계산
export const calculateItemDiscount = (
  item: CartItem,
  itemTotal: number
): {
  hasDiscount: boolean;
  discountRate: number;
  originalPrice: number;
} => {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return {
    hasDiscount,
    discountRate,
    originalPrice,
  };
};

// 할인율을 백분율로 포맷팅
export const formatDiscountRate = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

// 할인 금액 계산
export const calculateDiscountAmount = (originalPrice: number, discountedPrice: number): number => {
  return Math.max(0, originalPrice - discountedPrice);
};

// 할인율 계산
export const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
