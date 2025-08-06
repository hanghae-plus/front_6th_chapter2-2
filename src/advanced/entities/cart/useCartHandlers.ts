import { useCallback } from "react";
import { ProductWithUI } from "../products/product.types";
import { useCart } from "./useCart";
import { BaseHandlerProps } from "../../types/common";

interface UseCartHandlersProps extends BaseHandlerProps {}

/**
 * 장바구니 관련 핸들러들을 제공하는 훅 (네임스페이스 구조)
 */
export const useCartHandlers = ({ addNotification }: UseCartHandlersProps) => {
  const {
    cart,
    addToCart: addToCartAction,
    removeFromCart: removeFromCartAction,
    updateQuantity: updateQuantityAction,
    clearCart: clearCartAction,
    findCartItem,
    totalItemCount,
    isEmpty,
  } = useCart();

  // 장바구니에 상품 추가 핸들러
  const add = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartAction(product);
      addNotification(result.message, result.type);
    },
    [addToCartAction, addNotification]
  );

  // 장바구니에서 상품 제거 핸들러
  const remove = useCallback(
    (productId: string) => {
      const result = removeFromCartAction(productId);
      addNotification(result.message, result.type);
    },
    [removeFromCartAction, addNotification]
  );

  // 수량 변경 핸들러
  const update = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityAction(productId, newQuantity);
      addNotification(result.message, result.type);
    },
    [updateQuantityAction, addNotification]
  );

  // 장바구니 초기화 핸들러
  const clear = useCallback(() => {
    const result = clearCartAction();
    addNotification(result.message, result.type);
  }, [clearCartAction, addNotification]);

  // 장바구니 아이템 찾기
  const find = useCallback(
    (productId: string) => {
      return findCartItem(productId);
    },
    [findCartItem]
  );

  return {
    // 네임스페이스 구조
    state: {
      items: cart,
      totalItemCount,
      isEmpty,
    },
    actions: {
      add,
      remove,
      update,
      clear,
      find,
    },

    // 하위 호환성을 위해 기존 방식도 유지
    cart,
    totalItemCount,
    isEmpty,
    addToCart: add,
    removeFromCart: remove,
    updateQuantity: update,
    clearCart: clear,
    findCartItem: find,
  };
};
