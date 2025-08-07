import { useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "../../types";
import { useLocalStorage } from "./useLocalStorage";
import { InsufficientStockError, StockExceededError } from "../errors/Cart.error";
import { ProductNotFoundError } from "../errors/Product.error";
import { calculateTotalItemCount, getRemainingStock as getRemainingStockModel } from "../models/cart";
import { withTryNotifySuccess } from "../utils/withNotify";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";

const initCart = () => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

export const useCart = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", initCart);
  const [totalItemCount, setTotalItemCount] = useState(0);

  // 총 아이템 개수 계산
  useEffect(() => {
    const count = calculateTotalItemCount(cart);
    setTotalItemCount(count);
  }, [cart]);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      return getRemainingStockModel(product, cart);
    },
    [cart]
  );

  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        throw new InsufficientStockError(product.name, remainingStock);
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            throw new StockExceededError(product.name, product.stock, newQuantity);
          }

          return prevCart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return [...prevCart, { product, quantity: 1 }];
      });
    },
    [getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: Product[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) {
        throw new ProductNotFoundError(productId);
      }

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        throw new StockExceededError(product.name, maxStock, newQuantity);
      }

      setCart((prevCart) =>
        prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleAddToCart = useAutoCallback(
    withTryNotifySuccess(addToCart, "장바구니에 담았습니다.", addNotification ?? (() => {}))
  );

  const handleRemoveFromCart = useAutoCallback(
    withTryNotifySuccess(removeFromCart, "장바구니에서 제거되었습니다.", addNotification ?? (() => {}))
  );
  const handleUpdateQuantity = useAutoCallback(
    withTryNotifySuccess(updateQuantity, "수량이 업데이트되었습니다.", addNotification ?? (() => {}))
  );
  const handleClearCart = useAutoCallback(
    withTryNotifySuccess(clearCart, "장바구니가 비워졌습니다.", addNotification ?? (() => {}))
  );

  return {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};
