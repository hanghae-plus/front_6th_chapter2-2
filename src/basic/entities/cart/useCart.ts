import { useCallback, useMemo } from "react";
import { CartItem } from "../../../types";
import { ProductWithUI } from "../products/product.types";
import { calculateRemainingStock } from "../../utils/calculateRemainingStock";
import { useLocalStorageState } from "../../utils/hooks";
import { cartModel } from "./cart.model";
import { ActionResult } from "../../types/common";
import { MESSAGES } from "../../constants";

/**
 * 장바구니 상태 관리 훅
 */
export const useCart = () => {
  const [cart, setCart] = useLocalStorageState<CartItem[]>("cart", []);

  const addToCart = useCallback(
    (product: ProductWithUI): ActionResult => {
      const remainingStock = cartModel.getRemainingStock(product, cart);

      if (remainingStock <= 0) {
        return {
          success: false,
          message: MESSAGES.ERROR.STOCK_INSUFFICIENT,
          type: "error",
        };
      }

      const newCart = cartModel.addToCart(cart, product);
      const addFailed = newCart === cart; // 장바구니에 담기지 않은 경우

      if (addFailed) {
        return {
          success: false,
          message: MESSAGES.ERROR.STOCK_EXCEEDED(product.stock),
          type: "error",
        };
      }

      setCart(newCart);

      return {
        success: true,
        message: MESSAGES.SUCCESS.CART_ADDED,
        type: "success",
      };
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (productId: string): ActionResult => {
      const existingItem = cart.find((item) => item.product.id === productId);

      if (!existingItem) {
        return {
          success: false,
          message: "장바구니에 없는 상품입니다.",
          type: "error",
        };
      }

      setCart((prevCart) => cartModel.removeFromCart(prevCart, productId));

      return {
        success: true,
        message: "상품이 장바구니에서 제거되었습니다.",
        type: "success",
      };
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number): ActionResult => {
      const existingItem = cart.find((item) => item.product.id === productId);

      if (!existingItem) {
        return {
          success: false,
          message: "장바구니에 없는 상품입니다.",
          type: "error",
        };
      }

      if (newQuantity <= 0) {
        return removeFromCart(productId);
      }

      const product = existingItem.product;
      const remainingStock = calculateRemainingStock(product, cart);
      const currentQuantityInCart = existingItem.quantity;
      const availableStock = remainingStock + currentQuantityInCart;

      if (newQuantity > availableStock) {
        return {
          success: false,
          message: MESSAGES.ERROR.STOCK_EXCEEDED(product.stock),
          type: "error",
        };
      }

      setCart((prevCart) =>
        cartModel.updateQuantity(prevCart, productId, newQuantity)
      );

      return {
        success: true,
        message: "수량이 변경되었습니다.",
        type: "success",
      };
    },
    [cart, removeFromCart]
  );

  const clearCart = useCallback((): ActionResult => {
    setCart([]);
    return {
      success: true,
      message: "장바구니가 초기화되었습니다.",
      type: "success",
    };
  }, []);

  const findCartItem = useCallback(
    (productId: string): CartItem | undefined => {
      return cart.find((item) => item.product.id === productId);
    },
    [cart]
  );

  const totalItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    findCartItem,
    totalItemCount,
    isEmpty,
  };
};
