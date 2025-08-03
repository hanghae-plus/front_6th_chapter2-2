import { CartItem, Product } from "../types";

// 장바구니에 상품 추가
export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

// 장바구니에서 상품 제거
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

// 장바구니 상품 수량 변경
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};
