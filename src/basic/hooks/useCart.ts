// src/basic/hooks/useCart.ts
import { useState } from 'react';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { CartItem, Coupon, Product } from '../types';
import * as cartModel from '../models/cart';
import { useProducts } from './useProducts';

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { products } = useProducts(); // 재고 확인을 위해 상품 목록 사용

  const addToCart = (product: Product) => {
    const productWithStock = products.find(p => p.id === product.id);
    if (!productWithStock) return;

    setCart(prevCart => cartModel.addItemToCart(prevCart, productWithStock));
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => cartModel.removeItemFromCart(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => cartModel.updateCartItemQuantity(prevCart, productId, newQuantity));
  };
  
  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCoupon(null);
  }

  const cartTotal = cartModel.calculateCartTotal(cart, selectedCoupon);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
    cartTotal,
    clearCart
  };
};
