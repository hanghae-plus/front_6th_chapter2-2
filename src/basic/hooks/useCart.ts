// src/basic/hooks/useCart.ts
import { useAtom } from 'jotai';
import { cartAtom, selectedCouponAtom, productsAtom, toastMessageAtom } from '../store/atoms';
import { Product, Coupon } from '../types';
import * as cartModel from '../models/cart';
import { useSetAtom } from 'jotai';

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [products] = useAtom(productsAtom);
  const setToastMessage = useSetAtom(toastMessageAtom); // 쓰기 전용 atom 사용

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const addToCart = (product: Product) => {
    const productWithStock = products.find(p => p.id === product.id);
    if (!productWithStock) return;

    setCart(prevCart => {
      const newCart = cartModel.addItemToCart(prevCart, productWithStock);
      const oldItem = prevCart.find(item => item.id === product.id);
      const newItem = newCart.find(item => item.id === product.id);

      if (!oldItem || (newItem && newItem.quantity > oldItem.quantity)) {
        showToast('장바구니에 담았습니다');
      } else {
        showToast('재고가 부족합니다.');
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
      setCart(prevCart => cartModel.updateCartItemQuantity(prevCart, productId, product.stock));
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
