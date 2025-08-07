// src/basic/hooks/useCart.ts
import { useState } from 'react';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { CartItem, Coupon, Product } from '../types';
import * as cartModel from '../models/cart';
import { useProducts } from './useProducts';

export const useCart = (showToast: (message: string) => void) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { products } = useProducts(); // 재고 확인을 위해 상품 목록 사용

  const addToCart = (product: Product) => {
    const productWithStock = products.find(p => p.id === product.id);
    if (!productWithStock) return;

    setCart(prevCart => {
      const newCart = cartModel.addItemToCart(prevCart, productWithStock);
      if (newCart.length > prevCart.length || newCart.find(item => item.id === product.id)!.quantity > (prevCart.find(item => item.id === product.id)?.quantity || 0)) {
        showToast('장바구니에 담았습니다');
      }
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => cartModel.removeItemFromCart(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      showToast(`재고는 ${product.stock}개까지만 있습니다`);
      return;
    }
    setCart(prevCart => cartModel.updateCartItemQuantity(prevCart, productId, newQuantity));
  };
  
  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  const clearCart = () => {
    setCart(cartModel.clearCart());
    setSelectedCoupon(null);
  }

  const cartTotal = cartModel.calculateCartTotal(cart, selectedCoupon);
  const totalQuantity = cartModel.getCartTotalQuantity(cart);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
    cartTotal,
    clearCart,
    totalQuantity
  };
};
