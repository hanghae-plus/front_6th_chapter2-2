import React, { createContext, useContext, ReactNode } from "react";
import { useCart } from "../hooks/useCart";
import { useNotificationContext } from "./NotificationContext";
import { useProductContext } from "./ProductContext";
import { ProductWithUI } from "../types";

interface CartContextType {
  cart: any[];
  totalItemCount: number;
  getRemainingStock: (product: any) => number;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
}

// 테스트 환경에서 사용할 상태
let testCart: any[] = [];
let testTotalItemCount = 0;

const CartContext = createContext<CartContextType>({
  cart: testCart,
  totalItemCount: testTotalItemCount,
  getRemainingStock: (product: any) => product.stock || 0,
  addToCart: (product: any) => {
    // 테스트 환경에서 실제로 장바구니에 추가
    const existingItem = testCart.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      testCart.push({ product, quantity: 1 });
    }
    testTotalItemCount = testCart.reduce((sum, item) => sum + item.quantity, 0);
  },
  removeFromCart: (productId: string) => {
    testCart = testCart.filter((item) => item.product.id !== productId);
    testTotalItemCount = testCart.reduce((sum, item) => sum + item.quantity, 0);
  },
  updateQuantity: (productId: string, newQuantity: number) => {
    const item = testCart.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = newQuantity;
      testTotalItemCount = testCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
  },
  clearCart: () => {
    testCart = [];
    testTotalItemCount = 0;
  },
});

export const useCartContext = () => {
  const context = useContext(CartContext);
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { addNotification } = useNotificationContext();
  const { products } = useProductContext();
  const {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart: baseAddToCart,
    removeFromCart,
    updateQuantity: baseUpdateQuantity,
    clearCart,
  } = useCart(products);

  const addToCart = (product: ProductWithUI) => {
    baseAddToCart(product, addNotification);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    baseUpdateQuantity(productId, newQuantity, addNotification);
  };

  const value = {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
