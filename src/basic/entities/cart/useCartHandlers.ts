import { useCallback } from "react";
import { ProductWithUI } from "../products/product.types";
import { useCart } from "./useCart";
import { BaseHandlerProps } from "../../types/common";

interface UseCartHandlersProps extends BaseHandlerProps {}

/**
 * 장바구니 관련 핸들러들을 제공하는 훅
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
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartAction(product);
      addNotification(result.message, result.type);
    },
    [addToCartAction, addNotification]
  );

  // 장바구니에서 상품 제거 핸들러
  const removeFromCart = useCallback(
    (productId: string) => {
      const result = removeFromCartAction(productId);
      addNotification(result.message, result.type);
    },
    [removeFromCartAction, addNotification]
  );

  // 수량 변경 핸들러
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityAction(productId, newQuantity);
      addNotification(result.message, result.type);
    },
    [updateQuantityAction, addNotification]
  );

  // 장바구니 초기화 핸들러
  const clearCart = useCallback(() => {
    const result = clearCartAction();
    addNotification(result.message, result.type);
  }, [clearCartAction, addNotification]);

  return {
    // 상태
    cart,
    totalItemCount,
    isEmpty,
    // 핸들러들
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    findCartItem,
  };
};
