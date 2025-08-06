import { Product, CartItem } from "../../types";

type AddToCartResult =
  | { success: true; cart: CartItem[] }
  | { success: false; cart: CartItem[]; reason: string };

// 요구사항
// - 장바구니
//     - 장바구니 내 상품 수량 조절 가능
//     - 각 상품의 이름, 가격, 수량과 적용된 할인율을 표시
//         - 적용된 할인율 표시 (예: "10% 할인 적용")
//     - 장바구니 내 모든 상품의 총액을 계산해야

// 1. 장바구니에 추가
// 2. 장바구니에서 제거
// 3. 장바구니에 담긴 상품 개수 증가
// 4. 장바구니에 담긴 상품 개수 감소
// 5. 장바구니 내 모든 상품의 할인율이 적용된 총액 계산

/**
 * 특정 상품을 장바구니에 담고 남은 재고 개수를 반환하는 함수
 */
export const getRemainingStock = (
  cart: CartItem[],
  product: Product
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

/**
 * 장바구니에 상품을 추가하는 함수
 * 1. 재고가 없는 경우 실패
 * 2. 재고가 부족한 경우 실패
 */
export const addToCart = (
  cart: CartItem[],
  product: Product
): AddToCartResult => {
  const remainingStock = getRemainingStock(cart, product);

  if (remainingStock <= 0) {
    return {
      success: false,
      cart,
      reason: `재고가 부족합니다!`,
    };
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (!existingItem) {
    return {
      success: true,
      cart: [...cart, { product, quantity: 1 }],
    };
  }

  const newQuantity = existingItem.quantity + 1;

  if (newQuantity <= product.stock) {
    return {
      success: true,
      cart: cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ),
    };
  }

  return {
    success: false,
    cart,
    reason: `재고는 ${product.stock}개까지만 있습니다.`,
  };
};

/**
 * 장바구니에서 상품을 제거하는 함수
 */
export const removeFromCart = (cart: CartItem[], productId: string) => {
  return cart.filter((item) => item.product.id !== productId);
};

export const updateQuantity = () => {};
export const calculateCartTotal = () => {};
