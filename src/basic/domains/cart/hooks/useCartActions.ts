import type { Dispatch, SetStateAction } from "react";

import type { CartItem, Product } from "../../../../types";
import { getRemainingStock } from "../utils";

interface UseCartActionsParams {
  cart: CartItem[];
  products: Product[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  setSelectedCoupon: (coupon: null) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
}

export function useCartActions({
  cart,
  products,
  setCart,
  setSelectedCoupon,
  addNotification
}: UseCartActionsParams) {
  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });

    addNotification("장바구니에 담았습니다", "success");
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
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
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const completeOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder
  };
}
