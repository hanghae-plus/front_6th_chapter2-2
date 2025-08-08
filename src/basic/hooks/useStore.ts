import { useMemo } from 'react';

import { useCart } from './useCart';
import { useCoupons } from './useCoupons';
import { useNotifications } from './useNotifications';
import { useProducts } from './useProducts';
import * as cartModel from '../models/cart';

export const useStore = () => {
  const { notifications, addNotification, dismissNotification } = useNotifications();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts({ addNotification });

  const { cart, addToCart, removeFromCart, updateQuantity, getRemainingStock, clearCart } = useCart(
    { products, addNotification },
  );

  const { coupons, addCoupon, selectedCoupon, applyCoupon, deleteCoupon } = useCoupons({
    addNotification,
  });

  const totals = useMemo(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  return {
    notifications,
    addNotification,
    dismissNotification,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getRemainingStock,
    clearCart,
    coupons,
    addCoupon,
    selectedCoupon,
    applyCoupon,
    deleteCoupon,
    totals,
  };
};
