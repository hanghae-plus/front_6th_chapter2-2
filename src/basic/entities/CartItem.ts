import { CartItem, Product, Coupon } from "../../types";
import { applyCouponDiscount } from "./Coupon";

const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);
};

export const getMaxApplicableDiscountWithBulkPurchase = (item: CartItem, cart: CartItem[]): number => {
  const baseDiscount = getMaxApplicableDiscount(item);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

export const calculateItemTotalWithBulkPurchase = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscountWithBulkPurchase(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null = null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotalWithBulkPurchase(item, cart);
  });

  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount(totalAfterDiscount, selectedCoupon);
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

// 장바구니에 아이템 추가
export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      return cart; // 재고 초과시 변경하지 않음
    }

    return cart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
  }

  return [...cart, { product, quantity: 1 }];
};

// 장바구니에서 아이템 제거
export const removeItemFromCart = (cart: CartItem[], cartItem: CartItem): CartItem[] => {
  return cart.filter((item) => item.product.id !== cartItem.product.id);
};

// 장바구니 아이템 수량 업데이트
export const updateCartItemQuantity = (cart: CartItem[], cartItem: CartItem, newQuantity: number): CartItem[] => {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, cartItem);
  }

  return cart.map((item) => (item.product.id === cartItem.product.id ? { ...item, quantity: newQuantity } : item));
};

// 장바구니의 총 아이템 개수 계산
export const getTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// 장바구니에서 특정 상품 찾기
export const findCartItem = (cart: CartItem[], product: Product): CartItem | undefined => {
  return cart.find((item) => item.product.id === product.id);
};

// 장바구니에 추가 가능한지 확인
export const canAddToCart = (cart: CartItem[], product: Product): boolean => {
  const existingItem = findCartItem(cart, product);
  const currentQuantity = existingItem?.quantity || 0;
  return currentQuantity < product.stock;
};
