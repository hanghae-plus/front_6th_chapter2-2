import { CartItem } from "../../types";
import { ProductWithUI } from "../types/product";

/** 장바구니에서 특정 상품 찾기 */
export const findCartItemByProductId = (cart: CartItem[], productId: string): CartItem | undefined => {
  return cart.find((item) => item.product.id === productId);
};

/** 장바구니에 상품 추가 */
export const addItemToCart = (cart: CartItem[], product: ProductWithUI): CartItem[] => {
  const existingItem = findCartItemByProductId(cart, product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      return cart; // 재고 초과 시 기존 장바구니 반환
    }

    return cart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
  }

  return [...cart, { product, quantity: 1 }];
};

/** 장바구니에서 상품 제거 */
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

/** 장바구니 상품 수량 업데이트 */
export const updateItemQuantity = (cart: CartItem[], productId: string, newQuantity: number, maxStock: number): CartItem[] => {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  if (newQuantity > maxStock) {
    return cart; // 재고 초과 시 기존 장바구니 반환
  }

  return cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
};

/** 재고 존재 여부 검증 */
export const validateStockAvailability = (product: ProductWithUI, cart: CartItem[]): boolean => {
  const cartItem = findCartItemByProductId(cart, product.id);
  const currentQuantity = cartItem?.quantity || 0;
  return currentQuantity < product.stock;
};

/** 수량 유효성 검증 */
export const validateQuantity = (newQuantity: number, maxStock: number): boolean => {
  return newQuantity > 0 && newQuantity <= maxStock;
};
