import { useCallback } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "../atoms/cartAtom";
import { CartItem } from "../../types";
import { ProductWithUI } from "../App";
import cartService from "../services/cart";
import orderService from "../services/order";
import { useNotification } from "./useNotification";

export function useCart() {
  const [cart, setCart] = useAtom(cartAtom);
  const { addNotification } = useNotification();

  // 액션 함수들
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = cartService.addItemToCart({
        cart,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          discounts: product.discounts,
        },
      });

      if (result.status === "success") {
        setCart(result.value);
        addNotification("장바구니에 담았습니다", "success");
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [cart, setCart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const result = cartService.removeItemFromCart({
        cart,
        productId,
      });

      if (result.status === "success") {
        setCart(result.value);
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [cart, setCart, addNotification]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = cartService.updateItemQuantity({
        cart,
        productId,
        newQuantity,
      });

      if (result.status === "success") {
        setCart(result.value);
      } else {
        addNotification(result.message, "error");
      }

      return result;
    },
    [cart, setCart, addNotification]
  );

  const resetCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // 계산 함수들
  const calculateItemTotal = useCallback(
    (item: CartItem) => {
      return cartService.calculateItemTotal({
        item,
        cart,
      });
    },
    [cart]
  );

  const calculateCartTotal = useCallback(() => {
    return cartService.calculateCartTotal({
      cart,
      selectedCoupon: null, // selectedCoupon은 useCoupon에서 관리
    });
  }, [cart]);

  const getRemainingStock = useCallback(
    (product: ProductWithUI) => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      const remaining = product.stock - (cartItem?.quantity || 0);
      return remaining;
    },
    [cart]
  );

  const getStockStatus = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      const isLowStock = remainingStock <= 5 && remainingStock > 0;
      const isOutOfStock = remainingStock <= 0;

      return {
        remainingStock,
        isLowStock,
        isOutOfStock,
      };
    },
    [getRemainingStock]
  );

  const completeOrder = useCallback(() => {
    const result = orderService.completeOrder({
      cart,
    });

    if (result.status === "success") {
      resetCart();
      addNotification("주문이 완료되었습니다!", "success");
    } else {
      addNotification(result.message, "error");
    }

    return result;
  }, [cart, resetCart, addNotification]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
    getStockStatus,
    completeOrder,
  };
}
