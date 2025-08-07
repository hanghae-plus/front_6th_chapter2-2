import {
  useCartService,
  useCouponService,
  useNotificationService,
  useOrderService,
  useProductService
} from '@/services';
import { useCallback, useMemo } from 'react';

export const useShoppingPageViewModel = () => {
  const notificationService = useNotificationService();

  const productService = useProductService();
  const couponService = useCouponService({
    addNotification: notificationService.addNotification
  });
  const orderService = useOrderService({
    addNotification: notificationService.addNotification
  });
  const cartService = useCartService({
    addNotification: notificationService.addNotification
  });

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
  }, [orderService.completeOrder, couponService, cartService]);

  const updateCartItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      cartService.updateQuantity(
        productId,
        newQuantity,
        productService.getProducts()
      );
    },
    [cartService.updateQuantity, productService.getProducts()]
  );

  const formatProductPrice = useCallback(
    (price: number, productId: string) => {
      return productService.formatPrice(
        price,
        productId,
        cartService.getCart()
      );
    },
    [productService.formatPrice, cartService.getCart()]
  );

  const filterProductsBySearch = useCallback(
    (searchTerm: string) => {
      return productService.filterProducts(
        productService.getProducts(),
        searchTerm
      );
    },
    [productService.filterProducts, productService.getProducts()]
  );

  return {
    // State
    cartTotals,
    cartItems: cartService.getCart(),
    coupons: couponService.getCoupons(),
    products: productService.getProducts(),
    selectedCoupon: couponService.selectedCoupon,

    // Actions
    applyCoupon: couponService.applyCoupon,
    resetSelectedCoupon: couponService.resetSelectedCoupon,
    addToCart: cartService.addToCart,
    updateQuantity: updateCartItemQuantity,
    completeOrder: completeOrder,
    removeFromCart: cartService.removeFromCart,
    formatPrice: formatProductPrice,
    filterProducts: filterProductsBySearch
  };
};
