import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem } from "../../types";

import { ProductWithUI } from "../App";
import {
  addItemToCart,
  getCartItemByProductId,
  getRemainingStock,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useCouponActions } from "./useCoupon";
import { useNotificationActions } from "./useNotification";

interface CartContextTypes {
  cart: CartItem[];
  totalItemCount: number;
}

interface CartContextActionsTypes {
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextTypes>({
  cart: [],
  totalItemCount: 0,
});

const CartContextActions = createContext<CartContextActionsTypes>({
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const CartProvider = memo(({ children }: PropsWithChildren) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []); // 장바구니 상태
  const [totalItemCount, setTotalItemCount] = useState(0);
  const { addNotification } = useNotificationActions();
  const { unapplyCoupon } = useCouponActions();

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      const existingItem = getCartItemByProductId(cart, product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) => addItemToCart(prevCart, product));
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const cartItem = cart.find((item) => item.product.id === productId);

      if (!cartItem?.product) return;

      const maxStock = cartItem.product.stock;

      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        updateCartItemQuantity(prevCart, productId, newQuantity)
      );
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    unapplyCoupon();
  }, []);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    setTotalItemCount(count);
  }, [cart]);

  const value = useMemo(() => {
    return {
      cart,
      totalItemCount,
    };
  }, [cart, totalItemCount]);

  const actions = useMemo(() => {
    return {
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  }, [addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      <CartContextActions.Provider value={actions}>
        {children}
      </CartContextActions.Provider>
    </CartContext.Provider>
  );
});

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export const useCartActions = () => {
  const context = useContext(CartContextActions);

  if (!context) {
    throw new Error("useCartActions must be used within a CartProvider");
  }

  return context;
};
