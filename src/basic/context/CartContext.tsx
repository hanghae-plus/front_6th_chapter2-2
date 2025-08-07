import React, { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';

const CartContext = createContext<ReturnType<typeof useCart> | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartApi = useCart();
  return <CartContext.Provider value={cartApi}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
};

