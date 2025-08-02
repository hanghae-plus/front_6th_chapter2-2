import {
  useCartService,
  useCouponService,
  useNotificationService,
  useOrderService,
  useProductService,
} from '@/services';
import { useCartStore, useCouponStore, useProductStore } from '@/store';
import { useCallback, useMemo } from 'react';

export const useShoppingPageViewModel = () => {
  // Services
  const notificationService = useNotificationService();
  const orderService = useOrderService();
  const cartService = useCartService();
  const productService = useProductService();
  const couponService = useCouponService();

  // Stores
  const productStore = useProductStore();
  const couponStore = useCouponStore();
  const cartStore = useCartStore();

  // Computed values
  const cartTotals = useMemo(() => {
    return orderService.calculateCartTotal(couponService.selectedCoupon);
  }, [orderService, couponService.selectedCoupon]);

  // Event handlers
  const completeOrder = useCallback(() => {
    const result = orderService.completeOrder(
      couponService.selectedCoupon,
      cartService.resetCart
    );
    if (result.resetCoupon) {
      couponService.resetSelectedCoupon();
    }
  }, [orderService, couponService, cartService]);

  const updateCartItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      cartService.updateQuantity(productId, newQuantity, productStore.products);
    },
    [cartService, productStore.products]
  );

  const formatProductPrice = useCallback(
    (price: number, productId: string) => {
      return productService.formatPrice(price, productId, cartStore.cart);
    },
    [productService, cartStore.cart]
  );

  const filterProductsBySearch = useCallback(
    (searchTerm: string) => {
      return productService.filterProducts(productStore.products, searchTerm);
    },
    [productService, productStore.products]
  );

  return {
    // State
    selectedCoupon: couponService.selectedCoupon,
    notifications: notificationService.notifications,
    cartTotals,

    // Actions
    applyCoupon: couponService.applyCoupon,
    resetSelectedCoupon: couponService.resetSelectedCoupon,
    removeNotification: notificationService.removeNotification,
    addNotification: notificationService.addNotification,
    addToCart: cartService.addToCart,
    updateQuantity: updateCartItemQuantity,
    completeOrder,
    removeFromCart: cartService.removeFromCart,
    formatPrice: formatProductPrice,
    filterProducts: filterProductsBySearch,

    // Computed properties
    calculateCartTotal: orderService.calculateCartTotal,

    // Stores
    productStore,
    couponStore,
    cartStore,
  };
};
