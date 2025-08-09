import { useCallback } from "react";
import { CartItem, Product } from "../../types";
import { useAtom } from "jotai";
import { cartAtom } from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useAtom<CartItem[]>(cartAtom);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      setCart((prev) => {
        const existingItem = prev.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...prev, { product, quantity }];
      });
    },
    [setCart]
  );

  // 장바구니에서 상품 수량 변경
  const updateCartItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) => {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });
    },
    [setCart]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    },
    [setCart]
  );

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // 장바구니에 상품이 있는지 확인
  const isInCart = useCallback(
    (productId: string) => {
      return cart.some((item) => item.product.id === productId);
    },
    [cart]
  );

  // 장바구니 아이템 가져오기
  const getCartItem = useCallback(
    (productId: string) => {
      return cart.find((item) => item.product.id === productId);
    },
    [cart]
  );

  return {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItem,
  };
};
