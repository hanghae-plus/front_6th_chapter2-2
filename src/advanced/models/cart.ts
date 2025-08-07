import { CartItem, Coupon, Product } from "../../types";
import { applyCouponDiscount } from "./coupon";

// ============================================================================
// 엔티티를 다루지 않는 함수
// ============================================================================

/**
 * 상품의 기본 할인율 계산 (수량 기반)
 */
const getBaseDiscount = (
  discounts: { quantity: number; rate: number }[],
  quantity: number
): number =>
  discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount,
    0
  );

/**
 * 대량구매 보너스 할인율 계산
 */
const calculateBulkDiscount = (
  baseDiscount: number,
  bonusRate: number = 0.05
): number => baseDiscount + bonusRate;

/**
 * 할인율 상한선 적용
 */
const applyDiscountCap = (
  discountRate: number,
  maxDiscount: number = 0.5
): number => Math.min(discountRate, maxDiscount);

/**
 * 남은 재고 계산
 */
const calculateRemainingStock = (stock: number, usedQuantity: number): number =>
  stock - usedQuantity;

/**
 * 주문번호 생성
 */
export const generateOrderNumber = (date: number): string => `ORD-${date}`;

/**
 * 재고 초과 검증
 */
export const isStockExceeded = (quantity: number, stock: number): boolean =>
  quantity > stock;

/**
 * 적용 가능한 최대 할인율 계산
 */
const getMaxApplicableDiscount = (
  baseDiscount: number,
  hasBulkPurchase: boolean
): number => {
  if (hasBulkPurchase) {
    const bulkDiscount = calculateBulkDiscount(baseDiscount);
    return applyDiscountCap(bulkDiscount);
  }

  return baseDiscount;
};

/**
 * 전체 가격에 할인율 적용
 */

export const applyDiscountPercentToTotal = (
  price: number,
  quantity: number,
  discountRate: number
) => Math.round(price * quantity * (1 - discountRate));

// ============================================================================
// 엔티티를 다루는 함수
// ============================================================================

/**
 * 장바구니에 대량구매 아이템이 있는지 확인
 */
const hasBulkPurchase = (
  cartItems: CartItem[],
  bulkThreshold: number
): boolean => cartItems.some((cartItem) => cartItem.quantity >= bulkThreshold);

/**
 * 장바구니에서 특정 상품 아이템 찾기
 */
const findCartItem = (
  cart: CartItem[],
  productId: string
): CartItem | undefined => cart.find((item) => item.product.id === productId);

/**
 * 기존 장바구니 아이템의 수량 업데이트
 */
const updateExistingCartItem = (
  cart: CartItem[],
  productId: string,
  additionalQuantity: number
): CartItem[] =>
  cart.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: item.quantity + additionalQuantity }
      : item
  );

/**
 * 새로운 카트 아이템 생성
 */
const createNewCartItem = (product: Product, quantity: number): CartItem => ({
  product,
  quantity,
});

/**
 * 장바구니에 새 아이템 추가
 */
const addNewItemToCart = (cart: CartItem[], newItem: CartItem): CartItem[] => [
  ...cart,
  newItem,
];

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 */
export const calculateItemTotal = (
  item: CartItem,
  allCartItems: CartItem[]
): number => {
  const { price, discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = getBaseDiscount(discounts, quantity);

  const discount = getMaxApplicableDiscount(
    baseDiscount,
    hasBulkPurchase(allCartItems, 10)
  );

  return applyDiscountPercentToTotal(price, quantity, discount);
};

/**
 * 할인 전 총액 계산
 */
export const calculateSubtotal = (cart: CartItem[]): number =>
  cart.reduce(
    (total, item) =>
      total + applyDiscountPercentToTotal(item.product.price, item.quantity, 0),
    0
  );

/**
 * 할인 후 총액 계산
 */
export const calculateDiscountedTotal = (cart: CartItem[]): number =>
  cart.reduce((total, item) => total + calculateItemTotal(item, cart), 0);

/**
 * 장바구니 총액 계산 (할인 전/후)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = calculateSubtotal(cart);
  const discountedTotal = calculateDiscountedTotal(cart);
  const totalAfterDiscount = coupon
    ? applyCouponDiscount(discountedTotal, coupon)
    : discountedTotal;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템 수량 변경
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

/**
 * 장바구니에 상품 추가
 */
export const addItemToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  const existingItem = findCartItem(cart, product.id);

  if (existingItem) {
    return updateExistingCartItem(cart, product.id, quantity);
  }

  const newItem = createNewCartItem(product, quantity);
  return addNewItemToCart(cart, newItem);
};

/**
 * 장바구니에서 상품 제거
 */
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => cart.filter((item) => item.product.id !== productId);

/**
 * 남은 재고 계산 (도메인 객체 처리)
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const usedQuantity = cartItem?.quantity || 0;
  return calculateRemainingStock(product.stock, usedQuantity);
};

/**
 * 장바구니에서 특정 상품 찾기
 */
export const findCartItemByProductId = (
  cart: CartItem[],
  productId: string
): CartItem | undefined => cart.find((item) => item.product.id === productId);

/**
 * 장바구니 총 아이템 개수 계산
 */
export const calculateTotalItemCount = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.quantity, 0);
