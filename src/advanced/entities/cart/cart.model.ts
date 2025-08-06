import { CartItem } from "../../../types";
import { ProductWithUI } from "../products/product.types";
import { calculateItemTotal } from "../../utils/calculateItemTotal";
import { calculateCartTotal } from "../../utils/calculateCartTotal";
import { calculateRemainingStock } from "../../utils/calculateRemainingStock";
import { getMaxApplicableDiscount } from "../../utils/getMaxApplicableDiscount";

export const cartModel = {
  /**
   * 적용 가능한 최대 할인율 계산 (utils 함수 위임)
   */
  getMaxApplicableDiscount,

  /**
   * 개별 아이템의 할인 적용 후 총액 계산 (utils 함수 위임)
   */
  calculateItemTotal,

  /**
   * 장바구니 총액 계산 (utils 함수 위임)
   */
  calculateCartTotal,

  /**
   * 장바구니 상품 수량 변경
   */
  updateQuantity: (
    cart: CartItem[],
    productId: string,
    quantity: number
  ): CartItem[] => {
    if (quantity <= 0) {
      // 수량 0 이하면 장바구니에서 제거
      return cart.filter((item) => item.product.id !== productId);
    }

    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: quantity } : item
    );
  },

  /**
   * 장바구니에 상품 추가
   */
  addToCart: (cart: CartItem[], product: ProductWithUI): CartItem[] => {
    // 이미 장바구니에 존재하는 상품 처리
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;

      // 재고 초과 시 기존 cart 반환
      if (newQuantity > product.stock) {
        return cart;
      }

      // 수량만 업데이트
      return cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    }

    // 장바구니에 없는 상품이면 새 아이템 추가
    return [...cart, { product, quantity: 1 }];
  },

  /**
   * 장바구니 상품 제거
   */
  removeFromCart: (cart: CartItem[], productId: string): CartItem[] => {
    return cart.filter((item) => item.product.id !== productId);
  },

  /**
   * 남은 재고 계산 (utils 함수 위임)
   */
  getRemainingStock: (product: ProductWithUI, cart: CartItem[]): number => {
    return calculateRemainingStock(product, cart);
  },
};
