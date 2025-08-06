import { useCallback, useMemo } from "react";
import { CartItem } from "../../../types";
import { ProductWithUI } from "../products/product.types";
import { calculateRemainingStock } from "../../utils/calculateRemainingStock";
import { useLocalStorageState } from "../../utils/hooks/useLocalStorageState";
import { cartModel } from "./cart.model";
import { ActionResult } from "../../types/common";

export const useCart = () => {
  const [cart, setCart] = useLocalStorageState<CartItem[]>("cart", []);

  const addToCart = useCallback(
    (product: ProductWithUI): ActionResult => {
      const remainingStock = cartModel.getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        return {
          success: false,
          message: "재고가 부족합니다!",
          type: "error",
        };
      }

      const newCart = cartModel.addToCart(cart, product);
      const addFailed = newCart === cart; // 장바구니에 담기지 않은 경우

      if (addFailed) {
        return {
          success: false,
          message: `재고는 ${product.stock}개까지만 있습니다.`,
          type: "error",
        };
      }

      setCart(newCart);

      return {
        success: true,
        message: "장바구니에 담았습니다",
        type: "success",
      };
    },
    [cart]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number): ActionResult => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return {
          success: true,
          message: "상품이 장바구니에서 제거되었습니다",
          type: "success",
        };
      }

      // 상품 찾기 (cart에서)
      const cartItem = cart.find((item) => item.product.id === productId);
      if (!cartItem) {
        return {
          success: false,
          message: "상품을 찾을 수 없습니다",
          type: "error",
        };
      }

      const maxStock = cartItem.product.stock;
      if (newQuantity > maxStock) {
        return {
          success: false,
          message: `재고는 ${maxStock}개까지만 있습니다.`,
          type: "error",
        };
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      return {
        success: true,
        message: "수량이 변경되었습니다",
        type: "success",
      };
    },
    [cart, removeFromCart]
  );

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItemCount,
  };
};
