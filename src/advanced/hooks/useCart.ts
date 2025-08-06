import { useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "../../types";
import { ProductWithUI } from "../types";
import { useLocalStorage } from "./useLocalStorage";

export function useCart(products: ProductWithUI[]) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      const remaining = product.stock - (cartItem?.quantity || 0);
      return remaining;
    },
    [cart]
  );

  const addToCart = useCallback(
    (
      product: ProductWithUI,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, getRemainingStock, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
