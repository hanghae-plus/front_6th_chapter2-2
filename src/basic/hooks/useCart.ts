import { useState, useEffect, useCallback } from "react";
import { CartItem, Product, Coupon } from "../../types";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getRemainingStock,
  calculateTotalItemCount,
  calculateCartTotal,
  generateOrderNumber,
  isStockExceeded,
  findCartItemByProductId,
} from "../models/cart";
import { findProductById } from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const count = calculateTotalItemCount(cart);
    setCartItemCount(count);
  }, [cart]);

  const addToCart = useCallback(
    (
      product: Product,
      onSuccess: (message: string) => void,
      onError: (message: string) => void
    ) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        onError(ERROR_MESSAGES.STOCK_INSUFFICIENT);
        return;
      }

      const newCart = addItemToCart(cart, product);
      const addedItem = findCartItemByProductId(newCart, product.id);

      if (addedItem && isStockExceeded(addedItem.quantity, product.stock)) {
        onError(ERROR_MESSAGES.STOCK_EXCEEDED(product.stock));
        return;
      }

      setCart(newCart);
      onSuccess(SUCCESS_MESSAGES.ITEM_ADDED_TO_CART);
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(removeItemFromCart(cart, productId));
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number,
      products: Product[],
      onError: (message: string) => void
    ) => {
      if (newQuantity <= 0) {
        setCart(removeItemFromCart(cart, productId));
        return;
      }

      const product = findProductById(products, productId);
      if (!product) return;

      if (isStockExceeded(newQuantity, product.stock)) {
        onError(ERROR_MESSAGES.STOCK_EXCEEDED(product.stock));
        return;
      }

      setCart(updateCartItemQuantity(cart, productId, newQuantity));
    },
    [cart]
  );

  const completeOrder = useCallback((onSuccess: (message: string) => void) => {
    const orderNumber = generateOrderNumber(Date.now());
    onSuccess(SUCCESS_MESSAGES.ORDER_COMPLETED(orderNumber));
    setCart([]);
  }, []);

  const getStockForProduct = useCallback(
    (product: Product): number => {
      return getRemainingStock(product, cart);
    },
    [cart]
  );

  const calculateTotal = useCallback(
    (cartItems?: CartItem[], coupon?: Coupon | null) => {
      return calculateCartTotal(cartItems || cart, coupon || null);
    },
    [cart]
  );

  return {
    cart,
    setCart,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    getStockForProduct,
    calculateTotal,
  };
};
